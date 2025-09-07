# Mini PDF Q&A App

A Next.js application that allows users to upload PDF files and ask questions about their content using OpenAI's API and RAG (Retrieval-Augmented Generation) approach.

## Features

- **PDF Upload**: Secure file upload functionality
- **Text Extraction**: Automatic extraction of text content from uploaded PDFs
- **Vector Embeddings**: Generate embeddings using OpenAI API for semantic search
- **Q&A Interface**: Ask questions about PDF content and get intelligent answers
- **RAG Implementation**: Retrieval-based approach for accurate, context-aware responses

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI/ML**: OpenAI API (GPT & Embeddings)
- **Vector Database**: ChromaDB
- **File Processing**: PDF text extraction
- **Authentication**: Protected API routes

## Setup Instructions

### Prerequisites
- Node.js (v18 or later)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anushka-cseatmnc/Mini-PDF-Q-A-App.git
   cd Mini-PDF-Q-A-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

5. **Access the app**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## API Routes

### Route 1: PDF Upload & Processing
- **Endpoint**: `/api/upload`
- **Method**: POST
- **Functionality**: 
  - Accepts PDF file upload
  - Extracts text content
  - Generates vector embeddings via OpenAI
  - Stores embeddings in vector database

### Route 2: Q&A Processing
- **Endpoint**: `/api/chat`
- **Method**: POST
- **Functionality**:
  - Receives user questions
  - Performs semantic search on stored embeddings
  - Returns contextual answers using RAG approach

## Implementation Approach

1. **PDF Processing**: Used PDF parsing libraries to extract text content from uploaded files
2. **Embeddings Generation**: Leveraged OpenAI's text-embedding-ada-002 model for creating vector representations
3. **Vector Storage**: Implemented ChromaDB for efficient similarity search
4. **RAG Pipeline**: Built retrieval system that finds relevant document chunks and generates answers
5. **Security**: Implemented protected API routes with proper error handling
6. **UI/UX**: Clean, responsive interface built with Tailwind CSS

## Usage

1. Upload a PDF file using the file upload interface
2. Wait for processing confirmation
3. Enter questions about the PDF content
4. Receive AI-generated answers based on the document

## Project Structure

```
Mini-PDF-Q-A-App/
├── app/
│   ├── api/
│   │   ├── upload/route.js
│   │   └── chat/route.js
│   ├── components/
│   └── page.js
├── lib/
│   ├── openai.js
│   └── vectordb.js
├── package.json
└── README.md
```

## Future Enhancements

- Support for multiple file formats
- User authentication and session management
- Conversation history
- Advanced filtering and search options
- Deployment optimizations

---

**Developed as part of technical assessment - demonstrating full-stack development skills with AI integration**
