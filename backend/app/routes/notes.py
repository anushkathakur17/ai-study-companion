from fastapi import APIRouter, UploadFile

router = APIRouter()

@router.post("/upload")
async def upload_note(file: UploadFile):

    return {
        "filename": file.filename
    }