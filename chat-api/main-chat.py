from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
from functions import (
    load_document, clean, sentencizer, chunker, join_sentences, embedding,
    list_converter, db, search_result, chat
)
import os
from datetime import datetime
from typing import Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # List of domains that can communicate with the API
    allow_credentials=True,
    allow_methods=["*"],  # HTTP methods to allow, e.g., GET, POST, etc.
    allow_headers=["*"],  # HTTP headers to allow
)

class QueryRequest(BaseModel):
    query: str
    isPregnant: bool
    pregnancyDate: Optional[str] = Field(None, pattern=r'^\d{4}-\d{2}-\d{2}$')
    childBirthday: Optional[str] = Field(None, pattern=r'^\d{4}-\d{2}-\d{2}$')

collections = {}

# Specify your PDF file paths here
PDF_FILES = {
    "pregnant_month_1": "D:\Coding\Python\RAG\ValueHealth\Month 01.pdf",
    "pregnant_month_2": "D:\Coding\Python\RAG\ValueHealth\Month 02.pdf",
    "pregnant_month_3": "D:\Coding\Python\RAG\ValueHealth\Month 03.pdf",
    "pregnant_month_4": "D:\Coding\Python\RAG\ValueHealth\Month 04.pdf",
    "pregnant_month_5": "D:\Coding\Python\RAG\ValueHealth\Month 05.pdf",
    "pregnant_month_6": "D:\Coding\Python\RAG\ValueHealth\Month 06.pdf",
    "pregnant_month_7": "D:\Coding\Python\RAG\ValueHealth\Month 07.pdf",
    "pregnant_month_8": "D:\Coding\Python\RAG\ValueHealth\Month 08.pdf",
    "pregnant_month_9": "D:\Coding\Python\RAG\ValueHealth\Month 09.pdf",
    "child": "D:\Coding\Python\RAG\ValueHealth\Child.pdf",
}

@app.on_event("startup")
async def startup_event():
    global collections
    print("Loading documents...")

    for collection_name, file_path in PDF_FILES.items():
        collections[collection_name] = create_collection(file_path, collection_name)

def create_collection(file_path, collection_name):
    if not os.path.exists(file_path):
        print(f"Warning: File not found: {file_path}")
        return None
    data = load_document(file_path)
    if data is None:
        print(f"Warning: Failed to load document: {file_path}")
        return None
    print(f"Creating collection for: {collection_name}")
    final_data = clean(data)
    sentencizer(final_data)
    chunker(final_data, 12)
    final_chunked_data = join_sentences(final_data)
    embedding(final_chunked_data)
    documents, embeddings, ids = list_converter(final_chunked_data)
    return db(documents, embeddings, ids, collection_name)

@app.post("/query")
async def get_response(request: QueryRequest):
    query = request.query
    isPregnant = request.isPregnant
    today = datetime.now()

    print(f"Received request: {request}")

    if isPregnant:
        if not request.pregnancyDate:
            print("Error: pregnancyDate is missing for a pregnant user")
            raise HTTPException(status_code=400, detail="pregnancyDate is required when isPregnant is true")
        try:
            pregnancy_start = datetime.strptime(request.pregnancyDate, "%Y-%m-%d")
            pregnancy_month = (today.year - pregnancy_start.year) * 12 + today.month - pregnancy_start.month + 1
            pregnancy_month = min(max(pregnancy_month, 1), 9)
            collection_name = f"pregnant_month_{pregnancy_month}"
        except ValueError as e:
            print(f"Error parsing pregnancyDate: {e}")
            raise HTTPException(status_code=400, detail=f"Invalid pregnancyDate format: {e}")
    else:
        if not request.childBirthday:
            print("Error: childBirthday is missing for a non-pregnant user")
            raise HTTPException(status_code=400, detail="childBirthday is required when isPregnant is false")
        try:
            child_birthday = datetime.strptime(request.childBirthday, "%Y-%m-%d")
            collection_name = "child"
        except ValueError as e:
            print(f"Error parsing childBirthday: {e}")
            raise HTTPException(status_code=400, detail=f"Invalid childBirthday format: {e}")

    print(f"Calculated collection name: {collection_name}")

    collection = collections.get(collection_name)
    if not collection:
        print(f"Error: Collection not found: {collection_name}")
        raise HTTPException(status_code=404, detail=f"Collection not found: {collection_name}")

    print(f"Using collection: {collection_name}")

    context_str = await search_result(query, collection, 3)
    
    print("Context string:")
    print(context_str['documents'])
    
    response = chat.predict(query=query, context_str=context_str['documents'])
    return {"response": response}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8004)
