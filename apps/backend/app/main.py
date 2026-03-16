from fastapi import FastAPI
from routes import vulnerability, fraud, recommendation

app = FastAPI(
    title="AI Welfare Allocation Service",
    version="1.0"
)

app.include_router(vulnerability.router)
app.include_router(fraud.router)
app.include_router(recommendation.router)


@app.get("/")
def root():
    return {"message": "AI Service Running"}