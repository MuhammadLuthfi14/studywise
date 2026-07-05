from typing import Literal

from pydantic import BaseModel, ConfigDict


Role = Literal["mahasiswa", "admin"]
Status = Literal["aktif", "nonaktif"]
Gender = Literal["laki-laki", "perempuan"]


class UserRead(BaseModel):
    id: str
    nama: str
    email: str
    role: Role
    nim: str | None = None
    program_studi: str | None = None
    semester: int | None = None
    jenis_kelamin: Gender | None = None
    status: Status

    model_config = ConfigDict(from_attributes=True)


class UserAdminSave(BaseModel):
    id: str | None = None
    nama: str
    email: str
    role: Role = "mahasiswa"
    nim: str | None = None
    program_studi: str | None = None
    semester: int | None = None
    jenis_kelamin: Gender | None = None
    status: Status = "aktif"
    password: str | None = None


class UserUpdate(BaseModel):
    nama: str | None = None
    email: str | None = None
    role: Role | None = None
    nim: str | None = None
    program_studi: str | None = None
    semester: int | None = None
    jenis_kelamin: Gender | None = None
    status: Status | None = None
    password: str | None = None
