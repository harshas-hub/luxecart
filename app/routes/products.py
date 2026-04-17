from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload
from typing import Optional

from app.core.database import get_db
from app.models.product import Product
from app.models.category import Category
from app.schemas.schemas import ProductResponse, ProductListResponse

router = APIRouter(prefix="/api/products", tags=["Products"])


@router.get("", response_model=ProductListResponse)
def get_products(
    page: int = Query(1, ge=1),
    per_page: int = Query(12, ge=1, le=50),
    category_id: Optional[int] = None,
    search: Optional[str] = None,
    sort: Optional[str] = "newest",  # newest, price_low, price_high, rating
    db: Session = Depends(get_db),
):
    query = db.query(Product).options(joinedload(Product.category))

    if category_id:
        query = query.filter(Product.category_id == category_id)

    if search:
        query = query.filter(Product.title.ilike(f"%{search}%"))

    # Sort
    if sort == "price_low":
        query = query.order_by(Product.price.asc())
    elif sort == "price_high":
        query = query.order_by(Product.price.desc())
    elif sort == "rating":
        query = query.order_by(Product.rating.desc())
    else:
        query = query.order_by(Product.created_at.desc())

    total = query.count()
    products = query.offset((page - 1) * per_page).limit(per_page).all()

    return ProductListResponse(
        products=[ProductResponse.model_validate(p) for p in products],
        total=total,
        page=page,
        per_page=per_page,
    )


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = (
        db.query(Product)
        .options(joinedload(Product.category))
        .filter(Product.id == product_id)
        .first()
    )
    if not product:
        from fastapi import HTTPException, status

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )
    return ProductResponse.model_validate(product)
