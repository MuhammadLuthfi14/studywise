from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud import knowledge
from app.database import get_db
from app.routers.auth import require_admin
from app.schemas.knowledge import SymptomBase, SymptomRead


router = APIRouter(prefix="/symptoms", tags=["symptoms"])


@router.get("", response_model=list[SymptomRead])
def list_symptoms(
    include_inactive: bool = False,
    db: Session = Depends(get_db),
) -> list[SymptomRead]:
    return knowledge.list_symptoms(db, include_inactive=include_inactive)


@router.post("", response_model=SymptomRead, status_code=status.HTTP_201_CREATED)
def create_symptom(
    data: SymptomBase,
    db: Session = Depends(get_db),
    _: object = Depends(require_admin),
) -> SymptomRead:
    return knowledge.save_symptom(db, data)


@router.put("/{code}", response_model=SymptomRead)
def update_symptom(
    code: str,
    data: SymptomBase,
    db: Session = Depends(get_db),
    _: object = Depends(require_admin),
) -> SymptomRead:
    return knowledge.save_symptom(db, data.model_copy(update={"code": code}))


@router.delete("/{code}")
def delete_symptom(
    code: str,
    db: Session = Depends(get_db),
    _: object = Depends(require_admin),
) -> dict[str, str]:
    if not knowledge.delete_symptom(db, code):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Gejala tidak ditemukan.")
    return {"deleted": code}
