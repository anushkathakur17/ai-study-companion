from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.users import router as user_router

from app.database import engine, Base
from app.models import User

app = FastAPI()

Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    user_router,
    prefix="/users"
)

@app.get("/")
def home():
    return {
        "message":
        "AI Study Companion API Running"
    }