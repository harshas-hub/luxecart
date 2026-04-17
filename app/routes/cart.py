from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.cart import CartItem
from app.models.product import Product
from app.schemas.schemas import CartItemCreate, CartItemUpdate, CartItemResponse, CartResponse

router = APIRouter(prefix="/api/cart", tags=["Cart"])


@router.get("", response_model=CartResponse)
def get_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    items = (
        db.query(CartItem)
        .filter(CartItem.user_id == current_user.id)
        .options(joinedload(CartItem.product).joinedload(Product.category))
        .all()
    )
    total = sum(item.product.price * item.quantity for item in items)
    return CartResponse(
        items=[CartItemResponse.model_validate(i) for i in items],
        total=round(total, 2),
        item_count=sum(i.quantity for i in items),
    )


@router.post("/items", response_model=CartItemResponse)
def add_to_cart(
    item_data: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == item_data.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = (
        db.query(CartItem)
        .filter(
            CartItem.user_id == current_user.id,
            CartItem.product_id == item_data.product_id,
            CartItem.size == item_data.size,
        )
        .first()
    )

    if existing:
        existing.quantity += item_data.quantity
        db.commit()
        db.refresh(existing)
        # Eagerly load product
        _ = existing.product.category
        return CartItemResponse.model_validate(existing)

    cart_item = CartItem(
        user_id=current_user.id,
        product_id=item_data.product_id,
        quantity=item_data.quantity,
        size=item_data.size,
    )
    db.add(cart_item)
    db.commit()
    db.refresh(cart_item)
    _ = cart_item.product.category
    return CartItemResponse.model_validate(cart_item)


@router.put("/items/{item_id}", response_model=CartItemResponse)
def update_cart_item(
    item_id: int,
    item_data: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cart_item = (
        db.query(CartItem)
        .filter(CartItem.id == item_id, CartItem.user_id == current_user.id)
        .first()
    )
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    if item_data.quantity <= 0:
        db.delete(cart_item)
        db.commit()
        return CartItemResponse(
            id=item_id, product_id=cart_item.product_id, quantity=0, product=None
        )

    cart_item.quantity = item_data.quantity
    db.commit()
    db.refresh(cart_item)
    _ = cart_item.product.category
    return CartItemResponse.model_validate(cart_item)


@router.delete("/items/{item_id}")
def remove_from_cart(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cart_item = (
        db.query(CartItem)
        .filter(CartItem.id == item_id, CartItem.user_id == current_user.id)
        .first()
    )
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(cart_item)
    db.commit()
    return {"message": "Item removed from cart"}


@router.delete("")
def clear_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()
    return {"message": "Cart cleared"}
