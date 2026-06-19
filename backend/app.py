from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .verifier import verify_text


app = FastAPI(title="FactFox Verification API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class VerifyRequest(BaseModel):
    text: str


@app.get("/")
def health_check():
    return {
        "name": "FactFox Verification API",
        "status": "running",
    }


@app.post("/verify")
def verify_answer(request: VerifyRequest):
    return verify_text(request.text)
