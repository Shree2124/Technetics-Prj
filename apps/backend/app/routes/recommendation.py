from fastapi import APIRouter
from app.models.citizen_model import CitizenData
from app.services.recommendation_service import get_scheme_recommendations

router = APIRouter(prefix="/ai", tags=["AI Scheme Recommendation"])

@router.post("/scheme-recommendations")
def scheme_recommendations(data: CitizenData):

    """
    Provides scheme recommendations based on citizen data.
    """
    print(data)
    recommendations = get_scheme_recommendations(data)
    return {"recommendations": recommendations}
