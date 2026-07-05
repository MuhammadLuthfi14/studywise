from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


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

    model_config = ConfigDict(from_attributes=True)
