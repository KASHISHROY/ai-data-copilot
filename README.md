# AI Data Copilot

A schema-aware AI data analyst that lets users query databases using plain English.

## Full Description

AI Data Copilot is an AI-powered platform that allows users to upload datasets or connect live databases and ask questions in natural language. The system understands schema, generates safe SQL, validates queries, executes them, visualizes results, and explains insights in simple English.

## Current Status

Day 1, Part 2 is complete: the backend API has a working health check route, and the frontend can call it.

## Features

- Natural language to SQL
- Schema-aware SQL generation
- CSV/Excel/JSON upload
- PostgreSQL connection
- SQL safety validation
- Query execution
- SQL explanation
- SQL correction
- Charts and dashboards
- AI insights
- Query history
- Future RAG support
- Multi-agent architecture

## Why Schema Awareness Matters

Without schema awareness, AI can hallucinate fake tables and columns. This project prevents that by scanning actual schema before generating SQL.

## Example Prompt

“Show top 10 customers by total spending last month.”

## Local Backend Setup

1. Go into the backend folder:

   ```bash
   cd backend
   ```

2. Create a virtual environment:

   ```bash
   python -m venv .venv
   ```

3. Activate it on Windows PowerShell:

   ```bash
   .\.venv\Scripts\Activate.ps1
   ```

4. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Start the backend:

   ```bash
   uvicorn app.main:app --reload
   ```

6. Open the health route:

   ```text
   http://127.0.0.1:8000/health
   ```

## Local Frontend Setup

1. Go into the frontend folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the example environment file to `.env` and keep the local backend URL:

   ```text
   VITE_API_BASE_URL=http://127.0.0.1:8000
   ```

4. Start the frontend:

   ```bash
   npm run dev
   ```

5. Open the frontend:

   ```text
   http://localhost:5173
   ```

## Deployment Instructions

Deployment instructions will be added slowly as the project becomes ready for Render and Vercel.

## Future Scope

- MySQL support
- MongoDB support
- Supabase support
- BigQuery support
- Snowflake support
- Slack integration
- Team collaboration
- Audit logs
- RAG over schema
- Agentic dashboards
