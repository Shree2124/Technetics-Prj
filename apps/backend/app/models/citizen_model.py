from pydantic import BaseModel

class CitizenData(BaseModel):

    income: float
    employment_status: str
    family_size: int
    education_level: str
    health_condition: int
    housing_type: str
    disaster_risk: str