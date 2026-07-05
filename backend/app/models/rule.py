from sqlalchemy import JSON, Column, Float, String

from app.database import Base


class Rule(Base):
    __tablename__ = "rules"

    code = Column(String, primary_key=True, index=True)
    symptom_codes = Column(JSON, nullable=False, default=list)
    recommendation_code = Column(String, nullable=False, index=True)
    cf_pakar = Column(Float, nullable=False)
    status = Column(String, nullable=False, default="aktif")
