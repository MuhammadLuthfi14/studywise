from pydantic import BaseModel, Field

from app.schemas.user import Gender, UserRead


class LoginCredentials(BaseModel):
    email: str
    password: str


class RegisterData(BaseModel):
    nama: str
    nim: str
    email: str
    password: str = Field(min_length=6)
    program_studi: str
    semester: int
    jenis_kelamin: Gender


class AuthResponse(BaseModel):
    token: str
    user: UserRead
