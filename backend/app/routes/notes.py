from fastapi import APIRouter, UploadFile, Depends
from sqlalchemy.orm import Session
from pypdf import PdfReader

from app.database import SessionLocal
from app.models import Note

router = APIRouter()


# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Upload + Save note
@router.post("/upload")
async def upload_note(
    file: UploadFile,
    db: Session = Depends(get_db)
):

    reader = PdfReader(file.file)

    extracted_text = ""

    for page in reader.pages:
        text = page.extract_text()
        if text:
            extracted_text += text

    # SAVE TO DATABASE
    note = Note(
        title=file.filename,
        content=extracted_text
    )

    db.add(note)
    db.commit()
    db.refresh(note)

    return {
        "message": "Note saved successfully",
        "note_id": note.id
    }

@router.get("/")
def get_notes(db: Session = Depends(get_db)):

    notes = db.query(Note).order_by(Note.id.desc()).all()

    return notes