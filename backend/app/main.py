from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator


app = FastAPI(title="4DDecision Backend")

WEIGHT_MAP = {
    "default": {"past": 0.3, "present": 0.4, "future": 0.3},
    "rational": {"past": 0.33, "present": 0.44, "future": 0.23},
    "present_focused": {"past": 0.34, "present": 0.32, "future": 0.34},
    "planner": {"past": 0.23, "present": 0.44, "future": 0.33},
}


class DecisionScoreRequest(BaseModel):
    personality_type: str = Field(
        default="default",
        description="Personality type used to select the weighting strategy.",
    )
    past_score: float = Field(..., ge=0, le=100)
    present_score: float = Field(..., ge=0, le=100)
    future_score: float = Field(..., ge=0, le=100)

    @field_validator("personality_type")
    @classmethod
    def validate_personality_type(cls, value: str) -> str:
        normalized = value.strip().lower()
        if normalized not in WEIGHT_MAP:
            supported_types = ", ".join(WEIGHT_MAP.keys())
            raise ValueError(
                f"Unsupported personality_type '{value}'. "
                f"Supported values: {supported_types}."
            )
        return normalized


class DecisionScoreResponse(BaseModel):
    score: float
    weights: dict[str, float]
    decision: Literal["go_do_it", "not_now"]
    message: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/hello")
def hello_world() -> dict[str, str]:
    return {"message": "Hello from FastAPI backend"}


@app.post("/api/decision-score", response_model=DecisionScoreResponse)
def calculate_decision_score(
    payload: DecisionScoreRequest,
) -> DecisionScoreResponse:
    weights = WEIGHT_MAP[payload.personality_type]
    score = round(
        payload.past_score * weights["past"]
        + payload.present_score * weights["present"]
        + payload.future_score * weights["future"],
        2,
    )
    decision: Literal["go_do_it", "not_now"] = (
        "go_do_it" if score > 50 else "not_now"
    )
    message = (
        "Current weighted score supports taking action now."
        if decision == "go_do_it"
        else "Current weighted score suggests waiting for a better timing."
    )

    return DecisionScoreResponse(
        score=score,
        weights=weights,
        decision=decision,
        message=message,
    )
