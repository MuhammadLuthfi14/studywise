from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.security import create_access_token, decode_access_token, verify_password
from app.crud.user import create_registered_user, get_user, get_user_by_email
from app.database import get_db
from app.models.user import User
from app.schemas.auth import AuthResponse, LoginCredentials, RegisterData


router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def _auth_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Sesi tidak valid. Silakan login kembali.",
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    try:
        payload = decode_access_token(token)
    except ValueError as exc:
        raise _auth_error() from exc

    user_id = payload.get("sub")
    if not isinstance(user_id, str):
        raise _auth_error()

    user = get_user(db, user_id)
    if user is None:
        raise _auth_error()
    if user.status != "aktif":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Akun Anda nonaktif.")
    return user


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Akses admin diperlukan.")
    return current_user


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(data: RegisterData, db: Session = Depends(get_db)) -> AuthResponse:
    if get_user_by_email(db, data.email) is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email sudah digunakan.")

    user = create_registered_user(db, data)
    return AuthResponse(token=create_access_token(user.id), user=user)


@router.post("/login", response_model=AuthResponse)
def login(data: LoginCredentials, db: Session = Depends(get_db)) -> AuthResponse:
    user = get_user_by_email(db, data.email)
    if user is None or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email atau password salah.")
    if user.status != "aktif":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Akun Anda nonaktif. Hubungi admin.")

    return AuthResponse(token=create_access_token(user.id), user=user)
