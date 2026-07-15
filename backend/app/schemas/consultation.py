from datetime import datetime, timezone

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ConsultationAnswer(BaseModel):
    symptom_code: str
    cf_user: float = Field(ge=0, le=1)


class RecommendationResult(BaseModel):
    recommendation_code: str
    recommendation: str
    cf_value: float = Field(ge=0, le=1)
    percentage: int = Field(ge=0, le=100)
    reason: str


class ConsultationProcessRequest(BaseModel):
    answers: list[ConsultationAnswer]


class ConsultationProcessResponse(BaseModel):
    results: list[RecommendationResult]
    active_rules: list[str]


class ConsultationCreate(BaseModel):
    user_id: str
    user_nama: str
    answers: list[ConsultationAnswer]
    active_rules: list[str]
    results: list[RecommendationResult]


class ConsultationRead(BaseModel):
    id: str
    user_id: str
    user_nama: str
    created_at: datetime
    answers: list[ConsultationAnswer]
    active_rules: list[str]
    results: list[RecommendationResult]

    @field_validator("created_at")
    @classmethod
    def normalize_created_at_to_utc(cls, value: datetime) -> datetime:
        if value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc)
        return value.astimezone(timezone.utc)

    model_config = ConfigDict(from_attributes=True)
