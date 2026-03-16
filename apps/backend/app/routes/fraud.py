from fastapi import APIRouter
from models.citizen_model import CitizenData
from services.fraud_service import detect_fraud

router = APIRouter(prefix="/ai", tags=["AI Fraud Detection"])

@router.post("/fraud-detection")
def fraud_detection(data: CitizenData):
    """
    Analyzes citizen data to detect potential fraud.
    """
    result = detect_fraud(data)
    return result
