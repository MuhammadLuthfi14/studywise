from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


Status = Literal["aktif", "nonaktif"]


class SymptomBase(BaseModel):
    code: str
    name: str
    status: Status = "aktif"


class SymptomRead(SymptomBase):
    model_config = ConfigDict(from_attributes=True)


class RecommendationBase(BaseModel):
    code: str
    name: str
    description: str | None = None
    status: Status = "aktif"


class RecommendationRead(RecommendationBase):
    model_config = ConfigDict(from_attributes=True)


class RuleBase(BaseModel):
    code: str
    symptom_codes: list[str]
    recommendation_code: str
    cf_pakar: float = Field(ge=0, le=1)
    status: Status = "aktif"


class RuleRead(RuleBase):
    model_config = ConfigDict(from_attributes=True)
