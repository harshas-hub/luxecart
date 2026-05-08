from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.cart import CartItem
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.schemas import OrderCreate, OrderResponse
from app.i18n import get_locale, translator

router = APIRouter(prefix="/api/orders", tags=["Orders"])


def _build_order_response(order: Order, locale: str) -> OrderResponse:
    """Helper to build a localized OrderResponse from an Order model."""
    return OrderResponse(
        id=order.id,
        total=order.total,
        status=order.status,
        status_display=translator.t(locale, f"order_status.{order.status}"),
        shipping_address=order.shipping_address,
        created_at=str(order.created_at) if order.created_at else None,
        items=[
            {
                "id": i.id,
                "product_id": i.product_id,
                "quantity": i.quantity,
                "size": i.size,
                "price_at_time": i.price_at_time,
                "product": i.product,
            }
            for i in order.items
        ],
    )


@router.post("", response_model=OrderResponse)
def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    locale: str = Depends(get_locale),
):
    cart_items = (
        db.query(CartItem)
        .filter(CartItem.user_id == current_user.id)
        .options(joinedload(CartItem.product))
        .all()
    )

    if not cart_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=translator.t(locale, "messages.cart_empty"),
        )

    total = sum(item.product.price * item.quantity for item in cart_items)

    order = Order(
        user_id=current_user.id,
        total=round(total, 2),
        status="confirmed",
        shipping_address=order_data.shipping_address,
    )
    db.add(order)
    db.flush()

    for cart_item in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            size=cart_item.size,
            price_at_time=cart_item.product.price,
        )
        db.add(order_item)

    # Clear cart
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()
    db.refresh(order)

    # Reload with relationships
    order = (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.product))
        .filter(Order.id == order.id)
        .first()
    )

    return _build_order_response(order, locale)


@router.get("", response_model=list[OrderResponse])
def get_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    locale: str = Depends(get_locale),
):
    orders = (
        db.query(Order)
        .filter(Order.user_id == current_user.id)
        .options(joinedload(Order.items).joinedload(OrderItem.product))
        .order_by(Order.created_at.desc())
        .all()
    )

    return [_build_order_response(o, locale) for o in orders]
