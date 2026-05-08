from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import engine, Base
from app.models import User, Product, Category, CartItem, Order, OrderItem
from app.routes import auth_router, products_router, categories_router, cart_router, orders_router
from app.i18n import LocaleMiddleware, translator

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LuxeCart API",
    description="Premium E-Commerce API built with FastAPI",
    version="1.0.0",
)

# --- Middleware (order matters: last added = first executed) ---

# CORS must be added after LocaleMiddleware so CORS headers are always applied
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*", "Accept-Language"],
)

# Locale middleware: parses Accept-Language → request.state.locale
app.add_middleware(LocaleMiddleware)

# Include routers
app.include_router(auth_router)
app.include_router(products_router)
app.include_router(categories_router)
app.include_router(cart_router)
app.include_router(orders_router)


@app.get("/")
def read_root(request: Request):
    locale = getattr(request.state, "locale", "en")
    return {
        "message": translator.t(locale, "messages.welcome"),
        "docs": "/docs",
        "locale": locale,
    }