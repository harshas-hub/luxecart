from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import engine, Base
from app.models import User, Product, Category, CartItem, Order, OrderItem
from app.routes import auth_router, products_router, categories_router, cart_router, orders_router

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LuxeCart API",
    description="Premium E-Commerce API built with FastAPI",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(products_router)
app.include_router(categories_router)
app.include_router(cart_router)
app.include_router(orders_router)


@app.get("/")
def read_root():
    return {"message": "Welcome to LuxeCart API!", "docs": "/docs"}