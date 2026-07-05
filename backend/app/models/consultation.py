from datetime import datetime, timezone

from sqlalchemy import JSON, Column, DateTime, String

from app.database import Base


class Consultation(Base):
    __tablename__ = "consultations"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)
    user_nama = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    answers = Column(JSON, nullable=False, default=list)
    active_rules = Column(JSON, nullable=False, default=list)
    results = Column(JSON, nullable=False, default=list)
