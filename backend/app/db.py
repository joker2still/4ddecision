import os
import uuid
from datetime import datetime
from zoneinfo import ZoneInfo

from sqlalchemy import DateTime, Float, String, Text, create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker


DATABASE_URL = os.getenv("DATABASE_URL")
SHANGHAI_TIMEZONE = ZoneInfo("Asia/Shanghai")


class Base(DeclarativeBase):
    pass


class DecisionLog(Base):
    __tablename__ = "decision_logs"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(SHANGHAI_TIMEZONE),
        nullable=False,
    )
    anonymous_id: Mapped[str | None] = mapped_column(String(64))
    personality_type: Mapped[str] = mapped_column(String(32), nullable=False)
    scale_type: Mapped[str] = mapped_column(String(16), nullable=False)
    input_past_score: Mapped[float] = mapped_column(Float, nullable=False)
    input_present_score: Mapped[float] = mapped_column(Float, nullable=False)
    input_future_score: Mapped[float] = mapped_column(Float, nullable=False)
    normalized_past_score: Mapped[float] = mapped_column(Float, nullable=False)
    normalized_present_score: Mapped[float] = mapped_column(Float, nullable=False)
    normalized_future_score: Mapped[float] = mapped_column(Float, nullable=False)
    result_score: Mapped[float] = mapped_column(Float, nullable=False)
    decision: Mapped[str] = mapped_column(String(32), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    ip_address: Mapped[str | None] = mapped_column(String(128))
    user_agent: Mapped[str | None] = mapped_column(Text)
    referer: Mapped[str | None] = mapped_column(Text)
    origin: Mapped[str | None] = mapped_column(Text)
    accept_language: Mapped[str | None] = mapped_column(String(256))


engine = create_engine(DATABASE_URL, future=True) if DATABASE_URL else None
SessionLocal = (
    sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
    if engine
    else None
)


def initialize_database() -> None:
    if engine is None:
        return

    Base.metadata.create_all(bind=engine)
