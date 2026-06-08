from pydantic_settings import BaseSettings
from pydantic import field_validator


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    DATABASE_URL: str
    JWT_SECRET_KEY: str
    JWT_REFRESH_SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    JWT_ALGORITHM: str = "HS256"
    FRONTEND_URL: str = "http://localhost:5173"

    @field_validator("DATABASE_URL", mode="before")
    def fix_database_url(cls, v: str) -> str:
        if v:
            if v.startswith("mysql://"):
                v = v.replace("mysql://", "mysql+pymysql://", 1)
            v = v.replace("?ssl-mode=REQUIRED", "")
        return v
        
    @field_validator("FRONTEND_URL", mode="before")
    def fix_frontend_url(cls, v: str) -> str:
        if v and v.endswith("/"):
            return v.rstrip("/")
        return v

    class Config:
        env_file = ".env"


settings = Settings()
