import os
import tempfile
from datetime import datetime, timedelta
from pathlib import Path
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

test_db_path = Path(tempfile.gettempdir()) / f"studywise_test_{uuid4().hex}.db"
os.environ["DATABASE_URL"] = f"sqlite:///{test_db_path.as_posix()}"

from app.main import app
from app.database import engine


@pytest.fixture(scope="module")
def client() -> TestClient:
    with TestClient(app) as test_client:
        yield test_client
    engine.dispose()
    test_db_path.unlink(missing_ok=True)
    test_db_path.with_suffix(".db-shm").unlink(missing_ok=True)
    test_db_path.with_suffix(".db-wal").unlink(missing_ok=True)


def login(client: TestClient, email: str, password: str = "studywise123") -> tuple[dict[str, str], dict]:
    response = client.post("/auth/login", json={"email": email, "password": password})
    assert response.status_code == 200
    data = response.json()
    return {"Authorization": f"Bearer {data['token']}"}, data["user"]


def test_process_consultation_returns_dynamic_results(client: TestClient) -> None:
    headers, _ = login(client, "mahasiswa@studywise.ac.id")

    first_response = client.post(
        "/consultations/process",
        headers=headers,
        json={
            "answers": [
                {"symptom_code": "G02", "cf_user": 1.0},
                {"symptom_code": "G08", "cf_user": 0.75},
                {"symptom_code": "G09", "cf_user": 0.75},
                {"symptom_code": "G01", "cf_user": 0.5},
                {"symptom_code": "G18", "cf_user": 0.75},
            ]
        },
    )
    second_response = client.post(
        "/consultations/process",
        headers=headers,
        json={
            "answers": [
                {"symptom_code": "G06", "cf_user": 1.0},
                {"symptom_code": "G16", "cf_user": 1.0},
            ]
        },
    )

    assert first_response.status_code == 200
    assert second_response.status_code == 200
    first_data = first_response.json()
    second_data = second_response.json()
    assert [result["recommendation_code"] for result in first_data["results"]] == ["O04", "O03", "O01"]
    assert first_data["results"][0]["cf_value"] == 0.675
    assert first_data["results"][1]["cf_value"] == 0.6375
    assert second_data["results"][0]["recommendation_code"] == "O09"
    assert first_data != second_data


def test_save_and_read_consultation_history(client: TestClient) -> None:
    headers, user = login(client, "mahasiswa@studywise.ac.id")
    process_response = client.post(
        "/consultations/process",
        headers=headers,
        json={
            "answers": [
                {"symptom_code": "G06", "cf_user": 1.0},
                {"symptom_code": "G16", "cf_user": 1.0},
            ]
        },
    )
    assert process_response.status_code == 200
    processed = process_response.json()

    save_response = client.post(
        "/consultations",
        headers=headers,
        json={
            "user_id": user["id"],
            "user_nama": user["nama"],
            "answers": [
                {"symptom_code": "G06", "cf_user": 1.0},
                {"symptom_code": "G16", "cf_user": 1.0},
            ],
            "active_rules": processed["active_rules"],
            "results": processed["results"],
        },
    )
    assert save_response.status_code == 201
    saved_consultation = save_response.json()
    consultation_id = saved_consultation["id"]

    saved_created_at = datetime.fromisoformat(
        saved_consultation["created_at"].replace("Z", "+00:00")
    )
    assert saved_created_at.utcoffset() == timedelta(0)

    history_response = client.get(f"/consultations/history?user_id={user['id']}", headers=headers)
    detail_response = client.get(f"/consultations/{consultation_id}", headers=headers)

    assert history_response.status_code == 200
    assert any(item["id"] == consultation_id for item in history_response.json())
    assert detail_response.status_code == 200
    assert detail_response.json()["id"] == consultation_id
    detail_created_at = datetime.fromisoformat(
        detail_response.json()["created_at"].replace("Z", "+00:00")
    )
    assert detail_created_at.utcoffset() == timedelta(0)


def test_admin_crud_can_change_inference_results(client: TestClient) -> None:
    admin_headers, _ = login(client, "admin@studywise.ac.id")
    student_headers, _ = login(client, "mahasiswa@studywise.ac.id")
    suffix = uuid4().hex[:6].upper()
    symptom_code = f"GX{suffix}"
    recommendation_code = f"OX{suffix}"
    rule_code = f"RX{suffix}"

    symptom_response = client.post(
        "/symptoms",
        headers=admin_headers,
        json={"code": symptom_code, "name": "Gejala test API", "status": "aktif"},
    )
    recommendation_response = client.post(
        "/recommendations",
        headers=admin_headers,
        json={
            "code": recommendation_code,
            "name": "Rekomendasi test API",
            "description": "Dibuat oleh test API.",
            "status": "aktif",
        },
    )
    rule_response = client.post(
        "/rules",
        headers=admin_headers,
        json={
            "code": rule_code,
            "symptom_codes": [symptom_code],
            "recommendation_code": recommendation_code,
            "cf_pakar": 0.9,
            "status": "aktif",
        },
    )
    process_response = client.post(
        "/consultations/process",
        headers=student_headers,
        json={"answers": [{"symptom_code": symptom_code, "cf_user": 1.0}]},
    )

    assert symptom_response.status_code == 201
    assert recommendation_response.status_code == 201
    assert rule_response.status_code == 201
    assert process_response.status_code == 200
    assert process_response.json()["results"][0]["recommendation_code"] == recommendation_code
    assert process_response.json()["active_rules"] == [rule_code]


def test_non_admin_cannot_write_knowledge_base(client: TestClient) -> None:
    student_headers, _ = login(client, "mahasiswa@studywise.ac.id")

    response = client.put(
        "/rules/R01",
        headers=student_headers,
        json={
            "code": "R01",
            "symptom_codes": ["G01", "G18"],
            "recommendation_code": "O01",
            "cf_pakar": 0.9,
            "status": "aktif",
        },
    )

    assert response.status_code == 403
