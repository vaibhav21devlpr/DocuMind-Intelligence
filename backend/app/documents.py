from pathlib import Path
from uuid import uuid4
import fitz
from docx import Document as DocxDocument

ALLOWED = {".pdf", ".docx", ".txt"}

def extract_pages(path: Path) -> list[dict]:
    suffix = path.suffix.lower()
    pages = []
    if suffix == ".pdf":
        with fitz.open(path) as pdf:
            for i, page in enumerate(pdf):
                text = page.get_text("text").strip()
                if text:
                    pages.append({"page": i + 1, "text": text})
    elif suffix == ".docx":
        doc = DocxDocument(path)
        text = "\n".join(p.text for p in doc.paragraphs if p.text.strip())
        if text:
            pages.append({"page": 1, "text": text})
    elif suffix == ".txt":
        text = path.read_text(encoding="utf-8", errors="ignore").strip()
        if text:
            pages.append({"page": 1, "text": text})
    else:
        raise ValueError("Unsupported file type")
    if not pages:
        raise ValueError("No extractable text found. Scanned PDFs require OCR, which is not included in this MVP.")
    return pages

def make_chunks(pages: list[dict], chunk_size: int = 1800, overlap: int = 250) -> list[dict]:
    chunks = []
    for page in pages:
        text = page["text"]
        start = 0
        while start < len(text):
            end = min(len(text), start + chunk_size)
            chunk = text[start:end].strip()
            if chunk:
                chunks.append({"id": str(uuid4()), "text": chunk, "page": page["page"]})
            if end == len(text):
                break
            start = max(end - overlap, start + 1)
    return chunks
