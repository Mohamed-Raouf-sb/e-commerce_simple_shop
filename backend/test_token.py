import sys
sys.path.append("/app")

import jwt
from app.core.config import settings
from app.core.security import create_access_token

token = create_access_token({"sub": 1})
print(f"Token: {token}")

import requests
resp = requests.get("http://localhost:8000/api/orders", headers={"Authorization": f"Bearer {token}"})
print(resp.status_code)
print(resp.text)
