from sqlalchemy import Column, Integer, String

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    nama = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False, default="mahasiswa")
    nim = Column(String, nullable=True)
    program_studi = Column(String, nullable=True)
    semester = Column(Integer, nullable=True)
    jenis_kelamin = Column(String, nullable=True)
    status = Column(String, nullable=False, default="aktif")
