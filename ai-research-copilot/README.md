# AI Research Copilot

A full-stack, AI-powered web application allowing users to upload PDFs and research articles, extract insights, generate summaries, and prompt an intelligent AI Assistant capable of Retrieval-Augmented Generation (RAG).

## Features
- **Modern Next.js UI**: Sleek dark mode, animations, and split-screen document viewer/chat interface.
- **Authentication**: JWT-based login and signup flow.
- **Document Management**: Drag-and-drop PDF uploads, secure storage.
- **AI Pipeline**:
  - Text extraction from PDFs
  - Chunking and OpenAI Embeddings
  - Pinecone Vector Database context injection
  - Intelligent answering with source citations.

## Prerequisites
- Node.js 18+
- Docker & Docker Compose (optional for simple deployment)
- MongoDB
- Google Gemini API Key
- Pinecone API Key

## Setup Instructions

### 1. Environment Configuration
Copy the `.env.example` file to create your local `.env`.

```bash
cp .env.example .env
```

Populate the following in the `.env` file:
```
# Backend Environment Variables
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-research-copilot
JWT_SECRET=super_secret_jwt_key_here

# AI Service Variables
GOOGLE_API_KEY=your_google_gemini_api_key_here
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_env
PINECONE_INDEX=ai-research-copilot
```

### 2. Running with Docker Compose (Recommended)
You can build and start the entire stack (Frontend, Backend APIs, and MongoDB) effortlessly.

```bash
docker-compose up --build
```
- The frontend will be available at [http://localhost:3000](http://localhost:3000)
- The backend API will run on [http://localhost:5000](http://localhost:5000)

### 3. Running Manually

**Backend & AI Pipeline:**
```bash
cd backend
npm install
npm start
```
*(Optionally run AI Pipeline scripts standalone from `/ai_pipeline` using `node`)*

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Structure
- `/frontend` - Next.js React application
- `/backend` - Express REST APIs and MongoDB models
- `/ai_pipeline` - Langchain, Embeddings, RAG logic and utilities
