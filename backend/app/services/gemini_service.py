import os

import google.generativeai as genai

from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv(
        "GEMINI_API_KEY"
    )
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)

def generate_answer(
    question,
    chunks
):

    context = "\n\n".join(
        chunks
    )

    prompt = f"""

You are an AI study companion.

Answer ONLY using the provided notes.

If the answer is unavailable, say:

'I could not find this in your uploaded notes.'

Notes:

{context}

Question:

{question}

"""

    response = model.generate_content(
        prompt
    )

    return response.text