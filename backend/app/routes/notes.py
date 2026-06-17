from fastapi import APIRouter, UploadFile
from pypdf import PdfReader

router = APIRouter()

@router.post("/upload")
async def upload_note(file: UploadFile):

    reader = PdfReader(file.file)

    extracted_text = ""

    for page in reader.pages:

        extracted_text += page.extract_text()

    return {

        "filename": file.filename,

        "text": extracted_text

    }