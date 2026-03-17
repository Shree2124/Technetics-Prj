import sys
import os

# Add project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from app.routes import vulnerability, fraud, recommendation

app = FastAPI(
    title="AI Welfare Allocation Service",
    version="1.0"
)

app.include_router(vulnerability.router)
app.include_router(recommendation.router)


@app.get("/")
def root():
    return {"message": "AI Service Running"}