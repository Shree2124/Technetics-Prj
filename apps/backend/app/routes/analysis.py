from fastapi import APIRouter, HTTPException
from app.services.gemini_service import get_vulnerability_analysis
from app.db import get_db
from bson import ObjectId

router = APIRouter(prefix="/api", tags=["Analysis"])

@router.get("/analysis/vulnerability/{citizen_id}")
def get_citizen_vulnerability_analysis(citizen_id: str):
    """
    Provides a detailed vulnerability analysis for a specific citizen.
    """
    db = get_db()
    try:
        citizen = db.citizenprofiles.find_one({"_id": ObjectId(citizen_id)})
        if not citizen:
            raise HTTPException(status_code=404, detail="Citizen not found")

        # Convert ObjectId to string for serialization
        citizen['_id'] = str(citizen['_id'])
        if 'userId' in citizen:
            citizen['userId'] = str(citizen['userId'])

        analysis = get_vulnerability_analysis(citizen)
        return {"analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
