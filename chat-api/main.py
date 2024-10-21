from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from functions import (
    load_document, clean, sentencizer, chunker, join_sentences, embedding,
    list_converter, db, search_result, chat
)

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
    print('request:',request)
    
    query = request.query
    print("query response",query)
    context_str = await search_result(query, collection, 3)
    print('query :', query)
    response = chat.predict(query=query,context_str = context_str['documents'])
    print('response',response)
    print("After chat.predict")
    return {"response": response}
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app,host = "0.0.0.0", port=8001)