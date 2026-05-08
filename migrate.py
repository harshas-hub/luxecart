from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

# Setup database URL
db_url = os.getenv("DATABASE_URL")
if db_url.startswith("postgres://"):
    db_url = "postgresql://" + db_url[11:]

engine = create_engine(db_url)

with engine.begin() as conn:
    try:
        conn.execute(text("ALTER TABLE users ADD COLUMN preferred_locale VARCHAR DEFAULT 'en';"))
        print("\n✅ Successfully added 'preferred_locale' column to NeonDB PostgreSQL!")
    except Exception as e:
        print(f"\n❌ Error or column may already exist: {e}")
