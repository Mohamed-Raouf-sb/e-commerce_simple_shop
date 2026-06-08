from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    DATABASE_URL: str = "mysql+pymysql://dbuser:userpassword@db:3306/ecommerce_db"
    JWT_SECRET_KEY: str = "supersecretkeychangeinproduction"
    JWT_REFRESH_SECRET_KEY: str = "anothersecretkeychangeinproduction"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    JWT_ALGORITHM: str = "HS256"

    class Config:
        env_file = ".env"


settings = Settings()
