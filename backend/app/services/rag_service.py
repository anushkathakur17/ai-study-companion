from sentence_transformers import SentenceTransformer

import chromadb


model = None


def get_model():

    global model

    if model is None:

        model = SentenceTransformer(

            "all-MiniLM-L6-v2"

        )

    return model


client = chromadb.PersistentClient(

    path="./chroma_db"

)

collection = client.get_or_create_collection(

    name="study_notes"

)


def chunk_text(

    text,

    chunk_size=700

):

    paragraphs = text.split("\n")

    chunks = []

    current_chunk = ""

    for paragraph in paragraphs:

        if len(

            current_chunk

        ) + len(

            paragraph

        ) < chunk_size:

            current_chunk += paragraph + "\n"

        else:

            chunks.append(

                current_chunk

            )

            current_chunk = paragraph

    if current_chunk:

        chunks.append(

            current_chunk

        )

    return chunks


def store_note_in_rag(

    note_id,

    text

):

    model = get_model()

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

    model = get_model()

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