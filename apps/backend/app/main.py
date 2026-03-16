from fastapi import FastAPI
from routes import vulnerability

app = FastAPI(
    title="AI Welfare Allocation Service",
    version="1.0"
)

app.include_router(vulnerability.router)


@app.get("/")
def root():
    return {"message": "AI Service Running"}