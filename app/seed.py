"""
Seed script — fetches products from FakeStore API and seeds PostgreSQL.
Run: python -m app.seed
"""

import httpx
from app.core.database import SessionLocal, engine, Base
from app.models import Product, Category, User, CartItem, Order, OrderItem

FAKESTORE_URL = "https://fakestoreapi.com/products"


def slugify(text: str) -> str:
    return text.lower().replace(" ", "-").replace("'", "").replace("&", "and")


def seed():
    # Drop all tables first to reset schemas
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    print("Fetching products from FakeStore API...")
    response = httpx.get(FAKESTORE_URL)
    products_data = response.json()

    # Extract and create unique categories
    category_names = list(set(p["category"] for p in products_data))
    category_map = {}

    # Category images (curated for each FakeStore category)
    cat_images = {
        "electronics": "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
        "jewelery": "https://images.unsplash.com/photo-1515562141589-67f0d569b6e2?w=400",
        "men's clothing": "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400",
        "women's clothing": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400",
    }

    for name in category_names:
        cat = Category(
            name=name.title(),
            slug=slugify(name),
            image=cat_images.get(name, None),
        )
        db.add(cat)
        db.flush()
        category_map[name] = cat.id
        print(f"  Created category: {name.title()}")

    # Create products
    for p in products_data:
        category_name = p["category"]
        sizes_str = None
        if category_name in ["men's clothing", "women's clothing"]:
            sizes_str = "S,M,L,XL"
        elif category_name == "jewelery":
            sizes_str = "6,7,8,9,10"

        product = Product(
            title=p["title"],
            description=p["description"],
            price=p["price"],
            image=p["image"],
            rating=p["rating"]["rate"],
            rating_count=p["rating"]["count"],
            stock=100,
            sizes=sizes_str,
            category_id=category_map.get(p["category"]),
        )
        db.add(product)
        print(f"  Created product: {p['title'][:50]}...")

    db.commit()
    db.close()
    print(f"\nSeeded {len(products_data)} products and {len(category_names)} categories!")


if __name__ == "__main__":
    seed()
