from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.inference import process_consultation
from app.crud import consultation as consultation_crud
from app.crud import knowledge
from app.database import get_db
from app.models.user import User
from app.routers.auth import get_current_user, require_admin
from app.schemas.consultation import (
    ConsultationCreate,
    ConsultationProcessRequest,
    ConsultationProcessResponse,
    ConsultationRead,
)


router = APIRouter(prefix="/consultations", tags=["consultations"])


@router.post("/process", response_model=ConsultationProcessResponse)
def process_consultation_request(
    data: ConsultationProcessRequest,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> ConsultationProcessResponse:
    output = process_consultation(
        answers=[answer.model_dump() for answer in data.answers],
        rules=knowledge.list_rules(db),
        recommendations=knowledge.list_recommendations(db),
        symptoms=knowledge.list_symptoms(db),
    )
    return ConsultationProcessResponse(**output)


@router.post("", response_model=ConsultationRead, status_code=status.HTTP_201_CREATED)
def save_consultation(
    data: ConsultationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ConsultationRead:
    if current_user.role != "admin" and data.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Tidak dapat menyimpan konsultasi pengguna lain.")
    return consultation_crud.create_consultation(db, data)


@router.get("/history", response_model=list[ConsultationRead])
def get_history(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ConsultationRead]:
    if current_user.role != "admin" and user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Tidak dapat melihat riwayat pengguna lain.")
    return consultation_crud.list_consultations_by_user(db, user_id)


@router.get("", response_model=list[ConsultationRead])
def get_all_consultations(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> list[ConsultationRead]:
    return consultation_crud.list_consultations(db)


@router.get("/{consultation_id}", response_model=ConsultationRead)
def get_consultation(
    consultation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ConsultationRead:
    consultation = consultation_crud.get_consultation(db, consultation_id)
    if consultation is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Konsultasi tidak ditemukan.")
    if current_user.role != "admin" and consultation.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Tidak dapat melihat konsultasi pengguna lain.")
    return consultation
