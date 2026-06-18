from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.users import router as user_router
from app.routes.notes import router as notes_router

from app.database import engine, Base
from app.models import User, Note

from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

app = FastAPI()

limiter = Limiter(
    key_func=get_remote_address
)
app.state.limiter = limiter
app.add_middleware(
    SlowAPIMiddleware
)

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

app.include_router(
    notes_router,
    prefix="/notes"
)

@app.get("/")
def home():
    return {
        "message":
        "AI Study Companion API Running"
    }