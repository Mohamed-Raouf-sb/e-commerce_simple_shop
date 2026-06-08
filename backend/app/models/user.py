from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, Enum
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum("admin", "client", name="user_role"), default="client", nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
