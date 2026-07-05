from sqlalchemy.orm import Session

from app.models.recommendation import Recommendation
from app.models.rule import Rule
from app.models.symptom import Symptom
from app.schemas.knowledge import RecommendationBase, RuleBase, SymptomBase


def list_symptoms(db: Session, include_inactive: bool = False) -> list[Symptom]:
    query = db.query(Symptom)
    if not include_inactive:
        query = query.filter(Symptom.status == "aktif")
    return query.order_by(Symptom.code.asc()).all()


def save_symptom(db: Session, data: SymptomBase) -> Symptom:
    symptom = db.get(Symptom, data.code)
    if symptom is None:
        symptom = Symptom(**data.model_dump())
        db.add(symptom)
    else:
        for field, value in data.model_dump().items():
            setattr(symptom, field, value)
    db.commit()
    db.refresh(symptom)
    return symptom


def delete_symptom(db: Session, code: str) -> bool:
    symptom = db.get(Symptom, code)
    if symptom is None:
        return False
    db.delete(symptom)
    db.commit()
    return True


def list_recommendations(db: Session, include_inactive: bool = False) -> list[Recommendation]:
    query = db.query(Recommendation)
    if not include_inactive:
        query = query.filter(Recommendation.status == "aktif")
    return query.order_by(Recommendation.code.asc()).all()


def save_recommendation(db: Session, data: RecommendationBase) -> Recommendation:
    recommendation = db.get(Recommendation, data.code)
    if recommendation is None:
        recommendation = Recommendation(**data.model_dump())
        db.add(recommendation)
    else:
        for field, value in data.model_dump().items():
            setattr(recommendation, field, value)
    db.commit()
    db.refresh(recommendation)
    return recommendation


def delete_recommendation(db: Session, code: str) -> bool:
    recommendation = db.get(Recommendation, code)
    if recommendation is None:
        return False
    db.delete(recommendation)
    db.commit()
    return True


def list_rules(db: Session, include_inactive: bool = False) -> list[Rule]:
    query = db.query(Rule)
    if not include_inactive:
        query = query.filter(Rule.status == "aktif")
    return query.order_by(Rule.code.asc()).all()


def save_rule(db: Session, data: RuleBase) -> Rule:
    rule = db.get(Rule, data.code)
    if rule is None:
        rule = Rule(**data.model_dump())
        db.add(rule)
    else:
        for field, value in data.model_dump().items():
            setattr(rule, field, value)
    db.commit()
    db.refresh(rule)
    return rule


def delete_rule(db: Session, code: str) -> bool:
    rule = db.get(Rule, code)
    if rule is None:
        return False
    db.delete(rule)
    db.commit()
    return True
