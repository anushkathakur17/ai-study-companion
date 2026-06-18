from fastapi import (
    APIRouter,
    UploadFile,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from pypdf import PdfReader

from app.database import SessionLocal

from app.models import (
    Note,
    User
)

from app.auth import (
    get_current_user_email
)

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


def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()


@router.post("/upload")
async def upload_note(

    file: UploadFile,

    db: Session = Depends(get_db),

    email: str = Depends(
        get_current_user_email
    )

):

    user = db.query(User).filter(

        User.email == email

    ).first()

    reader = PdfReader(

        file.file

    )

    extracted_text = ""

    for page in reader.pages:

        text = page.extract_text()

        if text:

            extracted_text += text

    note = Note(

        title=file.filename,

        content=extracted_text,

        user_id=user.id

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
def get_notes(

    db: Session = Depends(

        get_db

    ),

    email: str = Depends(

        get_current_user_email

    )

):

    user = db.query(User).filter(

        User.email == email

    ).first()

    notes = (

        db.query(Note)

        .filter(

            Note.user_id == user.id

        )

        .order_by(

            Note.id.desc()

        )

        .all()

    )

    return notes


@router.get("/list")
def list_notes(

    db: Session = Depends(

        get_db

    ),

    email: str = Depends(

        get_current_user_email

    )

):

    user = db.query(User).filter(

        User.email == email

    ).first()

    notes = (

        db.query(Note)

        .filter(

            Note.user_id == user.id

        )

        .all()

    )

    return [

        {

            "id": note.id,

            "title": note.title

        }

        for note in notes

    ]


@router.get("/ask")
def ask_ai(

    question: str,

    db: Session = Depends(

        get_db

    ),

    email: str = Depends(

        get_current_user_email

    )

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

    db: Session = Depends(

        get_db

    ),

    email: str = Depends(

        get_current_user_email

    )

):

    user = db.query(User).filter(

        User.email == email

    ).first()

    note = (

        db.query(Note)

        .filter(

            Note.id == note_id,

            Note.user_id == user.id

        )

        .first()

    )

    if not note:

        raise HTTPException(

            status_code=404,

            detail="Note not found"

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

    db: Session = Depends(

        get_db

    ),

    email: str = Depends(

        get_current_user_email

    )

):

    user = db.query(User).filter(

        User.email == email

    ).first()

    note = (

        db.query(Note)

        .filter(

            Note.id == note_id,

            Note.user_id == user.id

        )

        .first()

    )

    if not note:

        raise HTTPException(

            status_code=404,

            detail="Note not found"

        )

    quiz = generate_quiz(

        [note.content]

    )

    return {

        "quiz": quiz

    }