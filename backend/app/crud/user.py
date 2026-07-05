from uuid import uuid4

from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.user import User
from app.schemas.auth import RegisterData
from app.schemas.user import UserAdminSave, UserUpdate


def get_user(db: Session, user_id: str) -> User | None:
    return db.get(User, user_id)


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email.strip().lower()).first()


def list_users(db: Session) -> list[User]:
    return db.query(User).order_by(User.nama.asc()).all()


def create_registered_user(db: Session, data: RegisterData) -> User:
    user = User(
        id=str(uuid4()),
        nama=data.nama,
        email=data.email.strip().lower(),
        password_hash=hash_password(data.password),
        role="mahasiswa",
        nim=data.nim,
        program_studi=data.program_studi,
        semester=data.semester,
        jenis_kelamin=data.jenis_kelamin,
        status="aktif",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_admin_saved_user(db: Session, data: UserAdminSave, default_password: str) -> User:
    user = User(
        id=data.id or str(uuid4()),
        nama=data.nama,
        email=data.email.strip().lower(),
        password_hash=hash_password(data.password or default_password),
        role=data.role,
        nim=data.nim,
        program_studi=data.program_studi,
        semester=data.semester,
        jenis_kelamin=data.jenis_kelamin,
        status=data.status,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user(db: Session, user: User, data: UserUpdate | UserAdminSave) -> User:
    values = data.model_dump(exclude_unset=True)
    password = values.pop("password", None)
    values.pop("id", None)
    if "email" in values and values["email"] is not None:
        values["email"] = values["email"].strip().lower()
    for field, value in values.items():
        setattr(user, field, value)
    if password:
        user.password_hash = hash_password(password)
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user: User) -> None:
    db.delete(user)
    db.commit()
