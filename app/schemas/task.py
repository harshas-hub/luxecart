from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

# 1. Base properties shared across multiple schemas
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None

# 2. Schema for creating a task (We only expect title and description from the user)
class TaskCreate(TaskBase):
    pass 

# 3. Schema for updating a task (Everything is optional here)
class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None

# 4. Schema for returning a task back to the React frontend
class TaskResponse(TaskBase):
    id: int
    is_completed: bool
    created_at: datetime

    # This is crucial! It tells Pydantic to read our SQLAlchemy database objects
    model_config = ConfigDict(from_attributes=True)