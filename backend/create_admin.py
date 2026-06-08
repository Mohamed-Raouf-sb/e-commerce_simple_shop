import os
import sys

sys.path.append("/app")

from app.database import SessionLocal
from app.models.user import User
from app.core.security import hash_password

db = SessionLocal()

username = os.getenv("ADMIN_USERNAME", "admin")
email = os.getenv("ADMIN_EMAIL", "admin@shop.com")
password = os.getenv("ADMIN_PASSWORD")

if not password:
    print("ERROR: ADMIN_PASSWORD environment variable is not set.")
    db.close()
    sys.exit(1)

existing = db.query(User).filter(User.email == email).first()
if existing:
    print(f"Admin already exists: {email}")
else:
    new_admin = User(
        username=username,
        email=email,
        hashed_password=hash_password(password),
        role="admin"
    )
    db.add(new_admin)
    db.commit()
    print(f"Admin created: email='{email}'")

db.close()
