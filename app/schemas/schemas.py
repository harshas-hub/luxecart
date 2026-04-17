from pydantic import BaseModel, EmailStr
from typing import Optional


# --- User Schemas ---
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    address: Optional[str] = None
    phone: Optional[str] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# --- Category Schemas ---
class CategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    image: Optional[str] = None

    class Config:
        from_attributes = True


# --- Product Schemas ---
class ProductResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    price: float
    image: Optional[str] = None
    rating: float = 0.0
    rating_count: int = 0
    stock: int = 100
    sizes: Optional[str] = None
    category_id: Optional[int] = None
    category: Optional[CategoryResponse] = None

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    products: list[ProductResponse]
    total: int
    page: int
    per_page: int


# --- Cart Schemas ---
class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = 1
    size: Optional[str] = None


class CartItemUpdate(BaseModel):
    quantity: int


class CartItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    size: Optional[str] = None
    product: ProductResponse

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    items: list[CartItemResponse]
    total: float
    item_count: int


# --- Order Schemas ---
class OrderCreate(BaseModel):
    shipping_address: str


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    size: Optional[str] = None
    price_at_time: float
    product: ProductResponse

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    total: float
    status: str
    shipping_address: Optional[str] = None
    created_at: Optional[str] = None
    items: list[OrderItemResponse] = []

    class Config:
        from_attributes = True
