from pydantic import BaseModel, EmailStr, ConfigDict

# ==========================================
# 1. CREATE USER (What the user sends us)
# ==========================================
class UserCreate(BaseModel):
    email: EmailStr  # This ensures the user types a valid email format!
    password: str

# ==========================================
# 2. USER RESPONSE (What we send back to React)
# ==========================================
class UserResponse(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    # Notice what is MISSING here? The password! 
    # We NEVER send passwords back to the frontend.

    model_config = ConfigDict(from_attributes=True)

# ==========================================
# 3. JWT TOKEN (The digital "Keycard")
# ==========================================
class Token(BaseModel):
    access_token: str
    token_type: str