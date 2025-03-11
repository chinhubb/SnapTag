from pydantic import BaseModel

class CheckboxItemSchema(BaseModel):
    id: int
    label: str

    class Config:
        from_attributes = True
