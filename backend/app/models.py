from sqlalchemy import Column, Integer, String
from .database import Base

class CheckboxItem(Base):
    __tablename__ = "checkbox_items"

    id = Column(Integer, primary_key=True, index=True)
    label = Column(String, unique=True, index=True)
