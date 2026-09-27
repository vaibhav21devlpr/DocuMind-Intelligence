
# DocuMind
Generative AI-Based Intelligent Document Analysis and Question Answering System

DocuMind is an AI-powered document analysis and question-answering platform that allows users to upload documents, generate summaries, extract keywords, and ask questions using Retrieval-Augmented Generation (RAG).

It uses Google Gemini for AI-powered analysis and ChromaDB for storing and retrieving document embeddings.

## Live Demo

- **Frontend:** https://docu-mind-intelligence.vercel.app
- **Backend API:** https://documind-intelligence-api.onrender.com
- **API Documentation:** https://documind-intelligence-api.onrender.com/docs

## Features

### 1. Document Upload and Processing

- Upload PDF, DOCX, and TXT documents.
- Extract text from uploaded documents.
- Automatically split documents into smaller chunks.
- Generate embeddings and store them in ChromaDB.

### 2. AI-Powered Document Summarization

Generate summaries in three different formats:

- Short Summary
- Medium Summary
- Detailed Summary

### 3. Chat with Documents

- Ask questions about uploaded documents.
- Get answers based on document content using RAG.
- Retrieve relevant document chunks using semantic search.
- Support for querying multiple uploaded documents.

### 4. Keyword and Topic Extraction

- Extract important keywords from documents.
- Identify key topics and concepts.
- Generate structured insights from document content.

### 5. Source Citations

- Display source references for AI-generated answers.
- Provide page references for PDF documents when available.
- Help users verify answers against the original documents.

## Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- Axios

### Backend

- Python
- FastAPI
- Uvicorn

### Generative AI

- Google Gemini API
- Gemini Embeddings (`gemini-embedding-001`)
- Retrieval-Augmented Generation (RAG)

### Vector Database

- ChromaDB

### Document Processing

- PyMuPDF
- python-docx

### Deployment

- Vercel (Frontend)
- Render (Backend)

## System Architecture

```text
                 USER
                   |
                   v
          React + Vite Frontend
                   |
                   v
              FastAPI Backend
                   |
          +--------+---------+
          |                  |
          v                  v
   Document Processing   Gemini API
   (PDF/DOCX/TXT)       (LLM + Embeddings)
          |                  |
          v                  |
     Text Chunking           |
          |                  |
          v                  |
       ChromaDB <-------------+
     Vector Database
          |
          v
    Semantic Retrieval
          |
          v
     Relevant Context
          |
          v
      Gemini LLM
          |
          v
   Answer + Citations
          |
          v
    React Frontend
```

## How It Works

### Step 1: Upload Documents

Users upload PDF, DOCX, or TXT files through the React frontend.

### Step 2: Text Extraction

The FastAPI backend extracts text from the uploaded documents using PyMuPDF and python-docx.

### Step 3: Chunking and Embeddings

Extracted text is divided into smaller chunks. Gemini generates embeddings for these chunks, which are stored in ChromaDB.

### Step 4: Query Processing

When a user asks a question, the backend generates an embedding for the query and searches ChromaDB for relevant document chunks.

### Step 5: AI Response Generation

The retrieved chunks are passed as context to the Gemini model, which generates an answer based on the available document content.

### Step 6: Display Results

The frontend displays the generated answer along with relevant source and page references when available.

## Project Structure

```text
DocuMind-Intelligence/
│
├── backend/
│   ├── app/
│   │   └── main.py
│   ├── requirements.txt
│   ├── .env.example
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
├── .gitignore
└── README.md
```

## Getting Started

Follow these instructions to run DocuMind locally.

### Prerequisites

Make sure you have the following installed:

- Python 3.11 or later
- Node.js 20 or later
- npm
- Google Gemini API Key

Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/).

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/vaibhav21devlpr/DocuMind-Intelligence.git
```

Navigate to the project directory:

```bash
cd DocuMind-Intelligence
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate the virtual environment.

**Windows:**

```bash
.venv\Scripts\activate
```

**macOS/Linux:**

```bash
source .venv/bin/activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Create your environment file from the example:

**Windows:**

```bash
copy .env.example .env
```

**macOS/Linux:**

```bash
cp .env.example .env
```

Add your Gemini API key to the `backend/.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend server:

```bash
uvicorn app.main:app --reload
```

The backend will run at:

```text
http://localhost:8000
```

Access the interactive API documentation at:

```text
http://localhost:8000/docs
```

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the frontend dependencies:

```bash
npm install
```

Create a `.env` file inside the frontend directory:

```env
VITE_API_URL=http://localhost:8000/api
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

## API Endpoints

The backend exposes the following API endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check backend status |
| GET | `/api/documents` | Retrieve uploaded documents |
| POST | `/api/documents` | Upload and process documents |
| DELETE | `/api/documents/{document_id}` | Delete a document |
| POST | `/api/chat` | Ask questions about documents |
| POST | `/api/summary` | Generate document summaries |
| POST | `/api/extract` | Extract keywords and topics |

For request parameters and response schemas, visit the FastAPI Swagger documentation.

## Environment Variables

### Backend (Render)

Configure the following environment variables in the Render dashboard:

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key |
| `FRONTEND_ORIGIN` | Frontend URL for CORS configuration |

Example:

```env
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_ORIGIN=https://docu-mind-intelligence.vercel.app
```

### Frontend (Vercel)

Configure the following environment variable in the Vercel dashboard:

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

Example:

```env
VITE_API_URL=https://documind-intelligence-api.onrender.com/api
```

Redeploy the frontend after changing environment variables.

## Deployment

### Frontend Deployment (Vercel)

1. Import the GitHub repository into Vercel.
2. Set the root directory to `frontend`.
3. Set the build command to `npm run build`.
4. Set the output directory to `dist`.
5. Configure the `VITE_API_URL` environment variable.
6. Deploy the project.

### Backend Deployment (Render)

1. Create a new Web Service on Render.
2. Connect the GitHub repository.
3. Set the root directory to `backend`.
4. Configure the build command:

```bash
pip install -r requirements.txt
```

5. Configure the start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

6. Add the required environment variables.
7. Deploy the backend.

Ensure the backend CORS configuration allows the deployed frontend origin.

## Important Notes

- A valid Google Gemini API key is required for AI-powered features.
- Keep API keys private and never commit `.env` files to GitHub.
- ChromaDB and uploaded files may be stored locally depending on the backend configuration.
- Local filesystem storage on Render's ephemeral instances may not persist across redeployments or instance replacements. Use persistent storage or a hosted database for production persistence.
- AI-generated answers may contain inaccuracies. Verify important information against the original documents.
- Avoid uploading confidential or sensitive documents unless the deployment has appropriate security and access controls.

## Future Enhancements

- User authentication and document access management.
- Persistent cloud storage for uploaded documents.
- Support for additional document formats.
- Document comparison and cross-document analysis.
- Chat history and conversation management.
- Export summaries and AI-generated reports.

## Author

**Vaibhav Pandey**

B.Tech in Computer Science and Engineering (IT)

- GitHub: [vaibhav21devlpr](https://github.com/vaibhav21devlpr)

## Acknowledgements

- Google Gemini API for generative AI and embeddings.
- FastAPI for backend development.
- ChromaDB for vector storage and semantic search.
- React and Vite for frontend development.

---

If you find this project useful, consider giving the repository a star!