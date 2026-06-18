from fastapi import APIRouter, UploadFile, Depends
from sqlalchemy.orm import Session
from pypdf import PdfReader

from app.database import SessionLocal
from app.models import Note

from app.services.rag_service import (
    retrieve_chunks,
    store_note_in_rag
)

from app.services.gemini_service import (
    generate_answer,
    generate_flashcards,
    generate_quiz
)

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

    store_note_in_rag(
        note.id,
        extracted_text
    )

    return {
        "message": "Note saved successfully",
        "note_id": note.id,
        "text": extracted_text
    }

@router.get("/")
def get_notes(db: Session = Depends(get_db)):

    notes = db.query(Note).order_by(Note.id.desc()).all()

    return notes

@router.get("/ask")
def ask_ai(
    question: str,
    db: Session = Depends(get_db)
):

    if not question.strip():

        return {
            "answer": "Please ask a question."
        }

    chunks = retrieve_chunks(
        question
    )

    answer = generate_answer(
        question,
        chunks
    )

    return {
        "answer": answer
    }

@router.get("/flashcards")
def flashcards(

    note_id: int,

    db: Session = Depends(get_db)

):

    note = db.get(

        Note,

        note_id

    )

    cards = generate_flashcards(

        [note.content]

    )

    return {

        "flashcards": cards

    }
@router.get("/quiz")
def quiz(

    note_id: int,

    db: Session = Depends(get_db)

):

    note = db.get(

        Note,

        note_id

    )

    quiz = generate_quiz(

        [note.content]

    )

    return {

        "quiz": quiz

    }
@router.get("/list")
def list_notes(
    db: Session = Depends(get_db)
):

    notes = db.query(Note).all()

    return [

        {
            "id": note.id,
            "title": note.title
        }

        for note in notes

    ]