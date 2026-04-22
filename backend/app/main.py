import os
from typing import Literal

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

from .db import DecisionLog, SessionLocal, initialize_database


app = FastAPI(title="4DDecision Backend")

WEIGHT_MAP = {
    "default": {"past": 0.3, "present": 0.4, "future": 0.3},
    "rational": {"past": 0.33, "present": 0.44, "future": 0.23},
    "present_focused": {"past": 0.34, "present": 0.32, "future": 0.34},
    "planner": {"past": 0.23, "present": 0.44, "future": 0.33},
}
SUPPORTED_SCALE_TYPES = {"hundred", "ten"}
STORE_RAW_IP = os.getenv("STORE_RAW_IP", "false").strip().lower() == "true"


class DecisionScoreRequest(BaseModel):
    personality_type: str = Field(
        default="default",
        description="Personality type used to select the weighting strategy.",
    )
    scale_type: str = Field(
        default="hundred",
        description="Display scale type selected by the user.",
    )
    anonymous_id: str | None = Field(
        default=None,
        description="Anonymous browser-level identifier generated on the client.",
    )
    input_past_score: float = Field(..., ge=0, le=100)
    input_present_score: float = Field(..., ge=0, le=100)
    input_future_score: float = Field(..., ge=0, le=100)
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

    @field_validator("scale_type")
    @classmethod
    def validate_scale_type(cls, value: str) -> str:
        normalized = value.strip().lower()
        if normalized not in SUPPORTED_SCALE_TYPES:
            supported_types = ", ".join(sorted(SUPPORTED_SCALE_TYPES))
            raise ValueError(
                f"Unsupported scale_type '{value}'. Supported values: "
                f"{supported_types}."
            )
        return normalized

    @field_validator("anonymous_id")
    @classmethod
    def validate_anonymous_id(cls, value: str | None) -> str | None:
        if value is None:
            return None

        normalized = value.strip()
        return normalized[:64] if normalized else None


class DecisionScoreResponse(BaseModel):
    score: float
    weights: dict[str, float]
    decision: Literal["go_for_it", "not_now"]
    message: str


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://4ddecision.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event() -> None:
    initialize_database()


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/hello")
def hello_world() -> dict[str, str]:
    return {"message": "Hello from FastAPI backend"}


def get_client_ip(request: Request) -> str | None:
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip() or None

    real_ip = request.headers.get("x-real-ip")
    if real_ip:
        return real_ip.strip() or None

    return request.client.host if request.client else None


def persist_decision_log(
    request: Request,
    payload: DecisionScoreRequest,
    response: DecisionScoreResponse,
) -> None:
    if SessionLocal is None:
        return

    client_ip = get_client_ip(request) if STORE_RAW_IP else None

    with SessionLocal() as session:
        session.add(
            DecisionLog(
                anonymous_id=payload.anonymous_id,
                personality_type=payload.personality_type,
                scale_type=payload.scale_type,
                input_past_score=payload.input_past_score,
                input_present_score=payload.input_present_score,
                input_future_score=payload.input_future_score,
                normalized_past_score=payload.past_score,
                normalized_present_score=payload.present_score,
                normalized_future_score=payload.future_score,
                result_score=response.score,
                decision=response.decision,
                message=response.message,
                ip_address=client_ip,
                user_agent=request.headers.get("user-agent"),
                referer=request.headers.get("referer"),
                origin=request.headers.get("origin"),
                accept_language=request.headers.get("accept-language"),
            )
        )
        session.commit()


@app.post("/api/decision-score", response_model=DecisionScoreResponse)
def calculate_decision_score(
    payload: DecisionScoreRequest,
    request: Request,
) -> DecisionScoreResponse:
    weights = WEIGHT_MAP[payload.personality_type]
    score = round(
        payload.past_score * weights["past"]
        + payload.present_score * weights["present"]
        + payload.future_score * weights["future"],
        2,
    )
    decision: Literal["go_for_it", "not_now"] = (
        "go_for_it" if score > 50 else "not_now"
    )
    message = (
        "Current weighted score supports taking action now."
        if decision == "go_for_it"
        else "Current weighted score suggests waiting for a better timing."
    )

    response = DecisionScoreResponse(
        score=score,
        weights=weights,
        decision=decision,
        message=message,
    )
    persist_decision_log(request, payload, response)
    return response
