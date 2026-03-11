PaperPilot: AI Research Literature Assistant
This repository contains the PaperPilot project, an AI-driven research literature assistant designed to help users extract information from academic papers, generate responses, and manage documents.

Structure
ai_pipeline/ - Frontend JavaScript code for AI processing, including PDF extraction and vector store management.
backend/ - Node.js API server with authentication, document routes, and AI model integration.
frontend/ - Next.js application for user interface, including login, dashboard, and document viewer.
database/ - Placeholder for database-related scripts and configuration.
Features
Modern Next.js UI: Sleek dark mode, animations, and split-screen document viewer/chat interface.
Authentication: JWT-based login and signup flow.
Document Management: Drag-and-drop PDF uploads, secure storage.
AI Pipeline:
Text extraction from PDFs
Chunking and OpenAI Embeddings
Pinecone Vector Database context injection
Intelligent answering with source citations.
Getting Started
Clone the repository:
git clone https://github.com/nehal-ag16/PaperPilot---AI-Research-Literature-Assistant.git
cd PaperPilot---AI-Research-Literature-Assistant
Install dependencies for each service (inside ai_pipeline, backend, and frontend).
Create a .env file with necessary environment variables (do not commit this file).
Start the development servers as described in each folder's README.
Notes
The .gitignore file is configured to exclude node_modules, .env files, and other common temporary files.
Make sure to add additional .env variables as needed for API keys, database connections, etc.
