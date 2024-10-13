from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from functions import (
    load_document, clean, sentencizer, chunker, join_sentences, embedding,
    list_converter, db, search_result, chat
)

app = FastAPI()

class QueryRequest(BaseModel):
    query: str

@app.on_event("startup")
async def startup_event():
    # Load and process the document on startup
    data = load_document("/Users/sarveshwar/Documents/projects/PedoPal-API/After delivery.pdf")
    if data is None:
        raise HTTPException(status_code=500, detail="Failed to load document")
    final_data = clean(data)
    sentencizer(final_data)
    chunker(final_data, 12)
    final_chunked_data = join_sentences(final_data)
    embedding(final_chunked_data)
    documents, embeddings, ids = list_converter(final_chunked_data)
    global collection
    collection = db(documents, embeddings, ids, "test2")

@app.post("/query")
async def get_response(request: QueryRequest):
    query = request.query
    print(query)
    context_str = await search_result(query, collection, 3)
    print("Before chat.predict")
    response = await chat.run({'query': query, 'context': context_str['documents']}, callbacks=[])
    print("After chat.predict")
    return {"response": response}
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, port=8001)