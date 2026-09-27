# DocuMind
Generative AI-Based Intelligent Document Analysis and Question Answering System is a Generative AI-powered application designed to help users efficiently understand, analyze, and interact with digital documents. The system will allow users to upload documents such as PDFs, DOCX, and text files, which will be processed using Natural Language Processing (NLP), embeddings, and Large Language Models (LLMs). It will provide AI-generated summaries in Short, Medium, and Detailed formats, along with automatic extraction of important keywords and topics. The system will also include a Chat with Document feature using Retrieval-Augmented Generation (RAG), enabling users to ask natural-language questions about single or multiple documents and receive context-aware answers with relevant source or page references. Overall, the project aims to provide an intelligent, user-friendly, and reliable solution for document analysis while demonstrating practical applications of Generative AI, RAG, semantic search, embeddings, and LLMs.

## Requirements
- Python 3.11+
- Node.js 20+
- Google Gemini API key from Google AI Studio

## Backend
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env  # Windows; on macOS/Linux: cp .env.example .env
```
Add your `GEMINI_API_KEY` to `backend/.env`, then:
```bash
uvicorn app.main:app --reload
```
API docs: http://127.0.0.1:8000/docs

## Frontend
In a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the URL Vite prints (normally http://localhost:5173).

## Notes
- ChromaDB and uploaded files are stored under `backend/data/`.
- The app is intended as a local educational MVP. Do not upload confidential documents.
- The backend uses Gemini's OpenAI-compatible API endpoint through the `google-genai` SDK's current REST API via `httpx` to keep the request format explicit. Configure model names in `.env`.
