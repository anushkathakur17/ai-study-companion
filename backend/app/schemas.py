from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str

class NoteResponse(BaseModel):
    id: int
    title: str
    content: str
    class Config:
        from_attributes = True