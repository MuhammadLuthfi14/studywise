from pathlib import Path
from uuid import uuid4

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.knowledge_base import KNOWLEDGE_BASE_VERSION
from app.database import Base
from app.models.consultation import Consultation
from app.models.recommendation import Recommendation
from app.models.rule import Rule
from app.models.seed_version import SeedVersion
from app.models.symptom import Symptom
from app.models.user import User
from app.seed import KNOWLEDGE_BASE_SEED_KEY, seed_database


def test_seed_migrates_legacy_knowledge_base_once(tmp_path: Path) -> None:
    db_path = tmp_path / f"studywise_seed_{uuid4().hex}.db"
    engine = create_engine(
        f"sqlite:///{db_path.as_posix()}",
        connect_args={"check_same_thread": False},
    )
    testing_session = sessionmaker(bind=engine)
    Base.metadata.create_all(bind=engine)

    db: Session = testing_session()
    try:
        db.add_all(
            [
                Symptom(code="G01", name="Gejala lama", status="aktif"),
                Symptom(code="GX1", name="Gejala tambahan", status="aktif"),
                Recommendation(
                    code="O01",
                    name="Rekomendasi lama",
                    description="Deskripsi lama",
                    status="aktif",
                ),
                Recommendation(
                    code="OX1",
                    name="Rekomendasi tambahan",
                    description="Tambahan",
                    status="aktif",
                ),
                Rule(
                    code="R01",
                    symptom_codes=["G01"],
                    recommendation_code="O01",
                    cf_pakar=0.5,
                    status="aktif",
                ),
                Rule(
                    code="RX1",
                    symptom_codes=["GX1"],
                    recommendation_code="OX1",
                    cf_pakar=0.5,
                    status="aktif",
                ),
                User(
                    id="existing-user",
                    nama="Pengguna Lama",
                    email="existing@studywise.ac.id",
                    password_hash="hash",
                    role="mahasiswa",
                    status="aktif",
                ),
                Consultation(
                    id="legacy-consultation",
                    user_id="existing-user",
                    user_nama="Pengguna Lama",
                    answers=[],
                    active_rules=["R01"],
                    results=[],
                ),
            ]
        )
        db.commit()

        seed_database(db)

        assert db.query(Symptom).count() == 20
        assert db.query(Recommendation).count() == 15
        assert db.query(Rule).count() == 29
        assert db.query(Consultation).count() == 0
        assert db.get(Symptom, "GX1") is None
        assert db.get(Recommendation, "OX1") is None
        assert db.get(Rule, "RX1") is None
        assert db.get(User, "existing-user") is not None
        assert db.get(User, "admin-seed") is not None
        assert db.get(User, "mahasiswa-seed") is not None
        assert db.get(Symptom, "G01").name.startswith("Memiliki tugas")
        assert db.get(Rule, "R29").cf_pakar == 0.85
        assert db.get(SeedVersion, KNOWLEDGE_BASE_SEED_KEY).version == KNOWLEDGE_BASE_VERSION

        db.get(Rule, "R01").cf_pakar = 0.42
        db.add(
            Consultation(
                id="new-consultation",
                user_id="existing-user",
                user_nama="Pengguna Lama",
                answers=[],
                active_rules=["R01"],
                results=[],
            )
        )
        db.commit()

        seed_database(db)

        assert db.get(Rule, "R01").cf_pakar == 0.42
        assert db.query(Consultation).count() == 1
    finally:
        db.close()
        engine.dispose()
