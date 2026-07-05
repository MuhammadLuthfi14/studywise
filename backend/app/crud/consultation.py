from uuid import uuid4

from sqlalchemy.orm import Session

from app.models.consultation import Consultation
from app.schemas.consultation import ConsultationCreate


def create_consultation(db: Session, data: ConsultationCreate) -> Consultation:
    consultation = Consultation(
        id=str(uuid4()),
        user_id=data.user_id,
        user_nama=data.user_nama,
        answers=[answer.model_dump() for answer in data.answers],
        active_rules=data.active_rules,
        results=[result.model_dump() for result in data.results],
    )
    db.add(consultation)
    db.commit()
    db.refresh(consultation)
    return consultation


def list_consultations(db: Session) -> list[Consultation]:
    return db.query(Consultation).order_by(Consultation.created_at.desc()).all()


def list_consultations_by_user(db: Session, user_id: str) -> list[Consultation]:
    return (
        db.query(Consultation)
        .filter(Consultation.user_id == user_id)
        .order_by(Consultation.created_at.desc())
        .all()
    )


def get_consultation(db: Session, consultation_id: str) -> Consultation | None:
    return db.get(Consultation, consultation_id)
