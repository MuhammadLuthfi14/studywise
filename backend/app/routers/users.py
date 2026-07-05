from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.knowledge_base import SEED_PASSWORD
from app.crud.user import (
    create_admin_saved_user,
    delete_user,
    get_user,
    get_user_by_email,
    list_users,
    update_user,
)
from app.database import get_db
from app.models.user import User
from app.routers.auth import require_admin
from app.schemas.user import UserAdminSave, UserRead


router = APIRouter(prefix="/users", tags=["users"])


def _ensure_unique_email(db: Session, email: str, current_id: str | None = None) -> None:
    existing = get_user_by_email(db, email)
    if existing is not None and existing.id != current_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email sudah digunakan.")


@router.get("", response_model=list[UserRead])
def get_users(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> list[UserRead]:
    return list_users(db)


@router.post("", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(
    data: UserAdminSave,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> UserRead:
    _ensure_unique_email(db, data.email)
    return create_admin_saved_user(db, data, default_password=SEED_PASSWORD)


@router.put("/{user_id}", response_model=UserRead)
def put_user(
    user_id: str,
    data: UserAdminSave,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> UserRead:
    _ensure_unique_email(db, data.email, current_id=user_id)
    user = get_user(db, user_id)
    data = data.model_copy(update={"id": user_id})
    if user is None:
        return create_admin_saved_user(db, data, default_password=SEED_PASSWORD)
    return update_user(db, user, data)


@router.delete("/{user_id}")
def remove_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
) -> dict[str, str]:
    if user_id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Admin tidak dapat menghapus akun sendiri.")
    user = get_user(db, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pengguna tidak ditemukan.")
    delete_user(db, user)
    return {"deleted": user_id}
