import pytest

from app.core.inference import process_consultation
from app.core.knowledge_base import RECOMMENDATIONS, RULES, SYMPTOMS


def test_process_consultation_uses_traceable_example() -> None:
    answers = [
        {"symptom_code": "G02", "cf_user": 1.0},
        {"symptom_code": "G08", "cf_user": 0.75},
        {"symptom_code": "G09", "cf_user": 0.75},
        {"symptom_code": "G01", "cf_user": 0.5},
        {"symptom_code": "G18", "cf_user": 0.75},
    ]

    output = process_consultation(
        answers=answers,
        rules=RULES,
        recommendations=RECOMMENDATIONS,
        symptoms=SYMPTOMS,
    )

    assert output["active_rules"] == ["R01", "R05", "R07"]
    assert [result["recommendation_code"] for result in output["results"]] == ["O04", "O03", "O01"]
    assert [result["cf_value"] for result in output["results"]] == [0.675, 0.6375, 0.45]
    assert [result["percentage"] for result in output["results"]] == [68, 64, 45]


def test_process_consultation_combines_same_recommendation_cf_values() -> None:
    output = process_consultation(
        answers=[
            {"symptom_code": "G01", "cf_user": 1.0},
            {"symptom_code": "G18", "cf_user": 1.0},
            {"symptom_code": "G02", "cf_user": 1.0},
            {"symptom_code": "G11", "cf_user": 1.0},
        ],
        rules=RULES,
        recommendations=RECOMMENDATIONS,
        symptoms=SYMPTOMS,
    )

    assert output["active_rules"] == ["R01", "R02", "R26"]
    assert output["results"][0]["recommendation_code"] == "O01"
    assert output["results"][0]["cf_value"] == pytest.approx(0.985)


def test_process_consultation_returns_empty_results_when_no_rule_fires() -> None:
    output = process_consultation(
        answers=[{"symptom_code": "G01", "cf_user": 1.0}],
        rules=RULES,
        recommendations=RECOMMENDATIONS,
        symptoms=SYMPTOMS,
    )

    assert output == {"results": [], "active_rules": []}


def test_process_consultation_ignores_zero_cf_answers() -> None:
    output = process_consultation(
        answers=[
            {"symptom_code": "G02", "cf_user": 1.0},
            {"symptom_code": "G08", "cf_user": 0.75},
            {"symptom_code": "G09", "cf_user": 0.0},
        ],
        rules=RULES,
        recommendations=RECOMMENDATIONS,
        symptoms=SYMPTOMS,
    )

    assert output == {"results": [], "active_rules": []}
