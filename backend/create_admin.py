import os
import sys

sys.path.append("/app")

from app.database import SessionLocal
from app.models.user import User
from app.core.security import hash_password

db = SessionLocal()

username = "admin"
email = "admin@shop.com"
password = "adminpassword"

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
    print(f"Admin created: email='{email}', password='{password}'")

db.close()
