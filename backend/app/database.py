import time
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Retry connecting to MySQL — it may take a few seconds to become ready
MAX_RETRIES = 10
RETRY_DELAY = 3  # seconds

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

for attempt in range(MAX_RETRIES):
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("Database connection established.")
        break
    except Exception as e:
        if attempt < MAX_RETRIES - 1:
            print(f"DB connection attempt {attempt + 1} failed: {e}. Retrying in {RETRY_DELAY}s...")
            time.sleep(RETRY_DELAY)
        else:
            print(f"Warning: Could not verify DB connection after {MAX_RETRIES} attempts. Proceeding anyway.")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency that provides a database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
