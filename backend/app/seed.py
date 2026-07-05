from sqlalchemy.orm import Session

from app.core.knowledge_base import RECOMMENDATIONS, RULES, SEED_PASSWORD, SEED_USERS, SYMPTOMS
from app.core.security import hash_password
from app.models.recommendation import Recommendation
from app.models.rule import Rule
from app.models.symptom import Symptom
from app.models.user import User


def seed_database(db: Session) -> None:
    for item in SYMPTOMS:
        if db.get(Symptom, item["code"]) is None:
            db.add(Symptom(**item))

    for item in RECOMMENDATIONS:
        if db.get(Recommendation, item["code"]) is None:
            db.add(Recommendation(**item))

    for item in RULES:
        if db.get(Rule, item["code"]) is None:
            db.add(Rule(**item))

    password_hash = hash_password(SEED_PASSWORD)
    for item in SEED_USERS:
        if db.get(User, item["id"]) is None:
            db.add(User(**item, password_hash=password_hash))

    db.commit()
