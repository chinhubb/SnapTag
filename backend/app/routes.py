from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import SessionLocal, engine, Base
from .models import CheckboxItem
from .schemas import CheckboxItemSchema
from pydantic import BaseModel

Base.metadata.create_all(bind=engine)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/checkboxes", response_model=list[CheckboxItemSchema])
def get_checkboxes(db: Session = Depends(get_db)):
    return db.query(CheckboxItem).all()

class CheckboxCreate(BaseModel):
    label: str

@router.post("/checkboxes", response_model=CheckboxItemSchema)
def create_checkbox(item: CheckboxCreate, db: Session = Depends(get_db)):
    db_item = CheckboxItem(label=item.label)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.put("/checkboxes/{id}", response_model=CheckboxItemSchema)
def update_checkbox(id: int, item: CheckboxCreate, db: Session = Depends(get_db)):
    db_item = db.query(CheckboxItem).filter(CheckboxItem.id == id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Checkbox not found")
    db_item.label = item.label
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/checkboxes/{id}")
def delete_checkbox(id: int, db: Session = Depends(get_db)):
    db_item = db.query(CheckboxItem).filter(CheckboxItem.id == id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Checkbox not found")
    db.delete(db_item)
    db.commit()
    return {"message": "Checkbox deleted"}
