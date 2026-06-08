from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = 1


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: Optional[str] = None
    quantity: int
    price: float

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    wilaya: str
    address: str
    delivery_fee: float


class OrderStatusUpdate(BaseModel):
    status: str  # "accepted" or "rejected"


class OrderResponse(BaseModel):
    id: int
    user_id: int
    username: Optional[str] = None
    status: str
    wilaya: str
    address: str
    delivery_fee: float
    total: float
    created_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True
