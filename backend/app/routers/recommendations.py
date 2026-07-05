from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud import knowledge
from app.database import get_db
from app.routers.auth import require_admin
from app.schemas.knowledge import RecommendationBase, RecommendationRead


router = APIRouter(prefix="/recommendations", tags=["recommendations"])


@router.get("", response_model=list[RecommendationRead])
def list_recommendations(
    include_inactive: bool = False,
    db: Session = Depends(get_db),
) -> list[RecommendationRead]:
    return knowledge.list_recommendations(db, include_inactive=include_inactive)


@router.post("", response_model=RecommendationRead, status_code=status.HTTP_201_CREATED)
def create_recommendation(
    data: RecommendationBase,
    db: Session = Depends(get_db),
    _: object = Depends(require_admin),
) -> RecommendationRead:
    return knowledge.save_recommendation(db, data)


@router.put("/{code}", response_model=RecommendationRead)
def update_recommendation(
    code: str,
    data: RecommendationBase,
    db: Session = Depends(get_db),
    _: object = Depends(require_admin),
) -> RecommendationRead:
    return knowledge.save_recommendation(db, data.model_copy(update={"code": code}))


@router.delete("/{code}")
def delete_recommendation(
    code: str,
    db: Session = Depends(get_db),
    _: object = Depends(require_admin),
) -> dict[str, str]:
    if not knowledge.delete_recommendation(db, code):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rekomendasi tidak ditemukan.")
    return {"deleted": code}
