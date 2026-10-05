from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl
from fastapi.middleware.cors import CORSMiddleware

from predictor import PhishingDetector


# --------------------------------------------------
# Create FastAPI application
# --------------------------------------------------

app = FastAPI(
    title="PhishGuard AI",
    description="AI-powered fake website and phishing URL detection API",
    version="1.0.0"
)


# --------------------------------------------------
# Enable CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Load ML model
# --------------------------------------------------

detector = PhishingDetector()


# --------------------------------------------------
# Request model
# --------------------------------------------------

class URLRequest(BaseModel):
    url: HttpUrl


# --------------------------------------------------
# Root endpoint
# --------------------------------------------------

@app.get("/")
def root():

    return {
        "message": "PhishGuard AI API is running",
        "status": "online"
    }


# --------------------------------------------------
# Health endpoint
# --------------------------------------------------

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "model": "loaded"
    }


# --------------------------------------------------
# Prediction endpoint
# --------------------------------------------------

@app.post("/predict")
def predict(request: URLRequest):

    try:

        url = str(request.url)

        result = detector.predict(url)

        return result

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )