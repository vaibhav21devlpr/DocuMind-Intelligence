import chromadb
from .config import CHROMA_DIR

client = chromadb.PersistentClient(path=str(CHROMA_DIR))
collection = client.get_or_create_collection(
    name="documind_chunks",
    metadata={"hnsw:space": "cosine"}
)

def add_chunks(document_id: str, filename: str, chunks: list[dict], embeddings: list[list[float]]):
    collection.add(
        ids=[c["id"] for c in chunks],
        documents=[c["text"] for c in chunks],
        embeddings=embeddings,
        metadatas=[{"document_id": document_id, "filename": filename, "page": c["page"]} for c in chunks]
    )

def retrieve(query_embedding: list[float], document_ids: list[str], n_results: int = 6):
    # Chroma's where filter supports $in for multi-document retrieval.
    result = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results,
        where={"document_id": {"$in": document_ids}},
        include=["documents", "metadatas", "distances"]
    )
    docs = result.get("documents", [[]])[0]
    metas = result.get("metadatas", [[]])[0]
    distances = result.get("distances", [[]])[0]
    return [{"text": d, **m, "distance": dist} for d, m, dist in zip(docs, metas, distances)]

def delete_document(document_id: str):
    collection.delete(where={"document_id": document_id})

def count_chunks(document_id: str) -> int:
    return collection.count(where={"document_id": document_id})
