from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud import knowledge
from app.database import get_db
from app.routers.auth import require_admin
from app.schemas.knowledge import RuleBase, RuleRead


router = APIRouter(prefix="/rules", tags=["rules"])


@router.get("", response_model=list[RuleRead])
def list_rules(
    include_inactive: bool = False,
    db: Session = Depends(get_db),
) -> list[RuleRead]:
    return knowledge.list_rules(db, include_inactive=include_inactive)


@router.post("", response_model=RuleRead, status_code=status.HTTP_201_CREATED)
def create_rule(
    data: RuleBase,
    db: Session = Depends(get_db),
    _: object = Depends(require_admin),
) -> RuleRead:
    return knowledge.save_rule(db, data)


@router.put("/{code}", response_model=RuleRead)
def update_rule(
    code: str,
    data: RuleBase,
    db: Session = Depends(get_db),
    _: object = Depends(require_admin),
) -> RuleRead:
    return knowledge.save_rule(db, data.model_copy(update={"code": code}))


@router.delete("/{code}")
def delete_rule(
    code: str,
    db: Session = Depends(get_db),
    _: object = Depends(require_admin),
) -> dict[str, str]:
    if not knowledge.delete_rule(db, code):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rule tidak ditemukan.")
    return {"deleted": code}
