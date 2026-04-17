from sqlalchemy.orm import Session
from app.models import task as models
from app.schemas import task as schemas

# ==========================================
# READ: Fetch multiple tasks
# ==========================================
def get_tasks(db: Session, skip: int = 0, limit: int = 100):
    # This is like saying: "SELECT * FROM tasks LIMIT 100 OFFSET 0"
    return db.query(models.Task).offset(skip).limit(limit).all()

# ==========================================
# READ: Fetch a single task by its ID
# ==========================================
def get_task(db: Session, task_id: int):
    # .first() stops searching as soon as it finds the matching ID, making it very fast
    return db.query(models.Task).filter(models.Task.id == task_id).first()

# ==========================================
# CREATE: Add a new task to the database
# ==========================================
def create_task(db: Session, task: schemas.TaskCreate):
    # 1. Convert the Pydantic schema (the validated data) into a SQLAlchemy model
    # **task.model_dump() unpacks the dictionary (e.g., title="Buy milk", description="2% milk")
    db_task = models.Task(**task.model_dump())
    
    # 2. Add it to our database session
    db.add(db_task)
    
    # 3. Commit the session (This physically saves it to the hard drive!)
    db.commit()
    
    # 4. Refresh the object to get the new ID that the database just generated
    db.refresh(db_task)
    
    return db_task

# ==========================================
# UPDATE: Edit an existing task
# ==========================================
def update_task(db: Session, task_id: int, task_data: schemas.TaskUpdate):
    # 1. Find the exact task in the database
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    
    if db_task:
        # 2. Get the new data the user sent, excluding anything they left blank
        update_data = task_data.model_dump(exclude_unset=True)
        
        # 3. Loop through the new data and update the database object
        for key, value in update_data.items():
            setattr(db_task, key, value)
            
        # 4. Save the changes!
        db.commit()
        db.refresh(db_task)
        
    return db_task

# ==========================================
# DELETE: Remove a task completely
# ==========================================
def delete_task(db: Session, task_id: int):
    # 1. Find the task
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    
    if db_task:
        # 2. Delete it from the session
        db.delete(db_task)
        # 3. Commit the change to the database
        db.commit()
        
    return db_task