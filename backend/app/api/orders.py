from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.security import get_current_user, require_admin
from app.models.user import User
from app.models.product import Product
from app.models.order import Order, OrderItem
from app.schemas.order import (
    OrderCreate,
    OrderResponse,
    OrderItemResponse,
    OrderStatusUpdate,
)

router = APIRouter()


def _build_order_response(order: Order, db: Session) -> dict:
    """Build order response dict with user and product details."""
    user = db.query(User).filter(User.id == order.user_id).first()
    items = []
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        items.append(
            OrderItemResponse(
                id=item.id,
                product_id=item.product_id,
                product_name=product.name if product else "Deleted Product",
                quantity=item.quantity,
                price=item.price,
            )
        )
    return OrderResponse(
        id=order.id,
        user_id=order.user_id,
        username=user.username if user else "Unknown",
        status=order.status,
        wilaya=order.wilaya,
        address=order.address,
        delivery_fee=order.delivery_fee,
        total=order.total,
        created_at=order.created_at,
        items=items,
    )


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Place an order (client). Reduces stock for each product."""
    if not order_data.items:
        raise HTTPException(status_code=400, detail="Order must contain at least one item")

    total = 0.0
    order_items = []

    for item_data in order_data.items:
        product = db.query(Product).filter(Product.id == item_data.product_id).first()
        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product with id {item_data.product_id} not found",
            )
        if product.stock < item_data.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for '{product.name}'. Available: {product.stock}",
            )

        item_total = product.price * item_data.quantity
        total += item_total

        order_items.append(
            OrderItem(
                product_id=product.id,
                quantity=item_data.quantity,
                price=product.price,
            )
        )

        # Reduce stock
        product.stock -= item_data.quantity

    # Add delivery fee
    total += order_data.delivery_fee

    # Create the order
    order = Order(
        user_id=current_user.id,
        total=round(total, 2),
        wilaya=order_data.wilaya,
        address=order_data.address,
        delivery_fee=order_data.delivery_fee,
        status="pending",
    )
    order.items = order_items
    db.add(order)
    db.commit()
    db.refresh(order)

    return _build_order_response(order, db)


@router.get("", response_model=List[OrderResponse])
def list_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List orders. Admin sees all, client sees own orders only."""
    if current_user.role == "admin":
        orders = db.query(Order).order_by(Order.created_at.desc()).all()
    else:
        orders = (
            db.query(Order)
            .filter(Order.user_id == current_user.id)
            .order_by(Order.created_at.desc())
            .all()
        )
    return [_build_order_response(o, db) for o in orders]


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a single order by ID."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Clients can only see their own orders
    if current_user.role != "admin" and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    return _build_order_response(order, db)


@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    status_data: OrderStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Accept or reject an order (admin only)."""
    if status_data.status not in ("accepted", "rejected"):
        raise HTTPException(
            status_code=400,
            detail="Status must be 'accepted' or 'rejected'",
        )

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.status != "pending":
        raise HTTPException(
            status_code=400,
            detail=f"Order has already been {order.status}",
        )

    # If rejecting, restore stock
    if status_data.status == "rejected":
        for item in order.items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            if product:
                product.stock += item.quantity

    order.status = status_data.status
    db.commit()
    db.refresh(order)

    return _build_order_response(order, db)
