from sqlalchemy.orm import Session
from app.models import user as models
from app.schemas import user as schemas
from app.core.security import get_password_hash

# ==========================================
# READ: Find a user by their email
# ==========================================
def get_user_by_email(db: Session, email: str):
    # We will use this for two things:
    # 1. Making sure someone doesn't sign up twice with the same email.
    # 2. Finding the user in the database when they try to log in.
    return db.query(models.User).filter(models.User.email == email).first()


# ==========================================
# CREATE: Register a new secure user
# ==========================================
def create_user(db: Session, user: schemas.UserCreate):
    # 1. Scramble the password using the security file we just made!
    hashed_password = get_password_hash(user.password)
    
    # 2. Build the database object (Notice we do NOT pass the raw password here)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    
    # 3. Save it to the database
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user