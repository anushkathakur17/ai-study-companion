from sentence_transformers import SentenceTransformer
import chromadb

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

client = chromadb.PersistentClient(
    path="./chroma_db"
)

collection = client.get_or_create_collection(
    name="study_notes"
)

def chunk_text(
    text,
    chunk_size=500
):

    chunks = []

    for i in range(
        0,
        len(text),
        chunk_size
    ):

        chunks.append(
            text[i:i+chunk_size]
        )

    return chunks

def store_note_in_rag(
    note_id,
    text
):

    chunks = chunk_text(
        text
    )

    embeddings = model.encode(
        chunks
    )

    for i in range(
        len(chunks)
    ):

        collection.add(

            ids=[
                f"{note_id}_{i}"
            ],

            documents=[
                chunks[i]
            ],

            embeddings=[
                embeddings[i].tolist()
            ]

        )

def retrieve_chunks(
    question,
    top_k=3
):

    question_embedding = model.encode(
        question
    )

    results = collection.query(

        query_embeddings=[
            question_embedding.tolist()
        ],

        n_results=top_k

    )

    return results[
        "documents"
    ][0]