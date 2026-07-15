from sqlalchemy import Column, Integer, String

from app.database import Base


class SeedVersion(Base):
    __tablename__ = "seed_versions"

    key = Column(String, primary_key=True)
    version = Column(Integer, nullable=False)
