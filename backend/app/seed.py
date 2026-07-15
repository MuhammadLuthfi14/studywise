from collections.abc import Iterable
from typing import Any

from sqlalchemy.orm import Session

from app.core.knowledge_base import (
    KNOWLEDGE_BASE_VERSION,
    RECOMMENDATIONS,
    RULES,
    SEED_PASSWORD,
    SEED_USERS,
    SYMPTOMS,
)
from app.core.security import hash_password
from app.models.consultation import Consultation
from app.models.recommendation import Recommendation
from app.models.rule import Rule
from app.models.seed_version import SeedVersion
from app.models.symptom import Symptom
from app.models.user import User


KNOWLEDGE_BASE_SEED_KEY = "knowledge_base"


def _replace_rows(
    db: Session,
    model: type[Any],
    rows: Iterable[dict[str, Any]],
) -> None:
    db.query(model).delete(synchronize_session=False)
    db.add_all(model(**row) for row in rows)


def _replace_knowledge_base(db: Session) -> None:
    # Kode rule final memiliki arti baru, sehingga riwayat lama tidak lagi konsisten.
    db.query(Consultation).delete(synchronize_session=False)
    db.query(Rule).delete(synchronize_session=False)
    _replace_rows(db, Symptom, SYMPTOMS)
    _replace_rows(db, Recommendation, RECOMMENDATIONS)
    db.add_all(Rule(**row) for row in RULES)


def _migrate_knowledge_base(db: Session) -> None:
    seed_version = db.get(SeedVersion, KNOWLEDGE_BASE_SEED_KEY)
    if seed_version is not None and seed_version.version >= KNOWLEDGE_BASE_VERSION:
        return

    _replace_knowledge_base(db)
    if seed_version is None:
        db.add(
            SeedVersion(
                key=KNOWLEDGE_BASE_SEED_KEY,
                version=KNOWLEDGE_BASE_VERSION,
            )
        )
    else:
        seed_version.version = KNOWLEDGE_BASE_VERSION


def _seed_users(db: Session) -> None:
    missing_users = [item for item in SEED_USERS if db.get(User, item["id"]) is None]
    if not missing_users:
        return

    password_hash = hash_password(SEED_PASSWORD)
    db.add_all(User(**item, password_hash=password_hash) for item in missing_users)


def seed_database(db: Session) -> None:
    try:
        _migrate_knowledge_base(db)
        _seed_users(db)
        db.commit()
    except Exception:
        db.rollback()
        raise
