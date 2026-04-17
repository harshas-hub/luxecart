from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import get_settings

settings = get_settings()

# Setup database URL correctly for SQLAlchemy 2.0
db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = "postgresql://" + db_url[11:]

# SQLite needs check_same_thread=False, PostgreSQL doesn't need it
connect_args = {}
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(db_url, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()