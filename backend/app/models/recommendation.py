from sqlalchemy import Column, String

from app.database import Base


class Recommendation(Base):
    __tablename__ = "recommendations"

    code = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(String, nullable=False, default="aktif")
