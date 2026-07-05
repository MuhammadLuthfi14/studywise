from sqlalchemy import Column, String

from app.database import Base


class Symptom(Base):
    __tablename__ = "symptoms"

    code = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    status = Column(String, nullable=False, default="aktif")
