from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.category import Category
from app.schemas.schemas import CategoryResponse

router = APIRouter(prefix="/api/categories", tags=["Categories"])


@router.get("", response_model=list[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).order_by(Category.name).all()
    return [CategoryResponse.model_validate(c) for c in categories]
