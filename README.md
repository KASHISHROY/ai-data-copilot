# AI Data Copilot

A schema-aware AI data analyst that lets users query databases using plain English.

## Full Description

AI Data Copilot is an AI-powered platform that allows users to upload datasets or connect live databases and ask questions in natural language. The system understands schema, generates safe SQL, validates queries, executes them, visualizes results, and explains insights in simple English.

## Current Status

Day 1 is complete:

- Backend FastAPI app created
- `/health` API route created
- Frontend React app created
- Tailwind CSS configured
- Frontend can call the backend health route
- Environment variable examples added
- Beginner setup notes added

## Project Structure

```text
ai-data-copilot/
  backend/
    app/
      __init__.py
      config.py
      main.py
    .env.example
    requirements.txt
  frontend/
    src/
      App.jsx
      api.js
      index.css
      main.jsx
    .env.example
    index.html
    package.json
    tailwind.config.js
    vite.config.js
  .gitignore
  README.md
```

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

"Show top 10 customers by total spending last month."

## Beginner Concepts

### Frontend

The frontend is the part users see in the browser. In this project it lives in the `frontend` folder and is built with React.

### Backend

The backend is the server. It will later handle uploads, schemas, SQL validation, query execution, and AI calls. In this project it lives in the `backend` folder and is built with FastAPI.

### API

An API is how the frontend talks to the backend. The frontend sends a request, and the backend sends back data.

### Route

A route is one API address. Our first route is:

```text
/health
```

### Health Check

A health check is a tiny API route used to confirm the backend is running. If `/health` returns `status: ok`, the backend is alive.

### Environment Variables

Environment variables are settings stored outside the code. They help us avoid hardcoding values that change between local development and production.

Example:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### CORS

CORS is a browser safety rule. Because the frontend and backend run on different local addresses, the backend must allow the frontend URL.

Local frontend:

```text
http://localhost:5173
```

Local backend:

```text
http://127.0.0.1:8000
```

## Local Backend Setup

Run these commands from the project root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Then open:

```text
http://127.0.0.1:8000/health
```

Expected backend response:

```json
{"status":"ok","service":"AI Data Copilot API","environment":"development"}
```

## Local Frontend Setup

Open a second PowerShell window and run these commands from the project root:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Then open:

```text
http://localhost:5173
```

The page should show that the backend connection is working.

## Environment Files

Use the `.env.example` files as templates.

Backend example:

```text
backend/.env.example
```

Frontend example:

```text
frontend/.env.example
```

For local development, you can create real `.env` files later. Real `.env` files are ignored by Git because they can contain private settings.

## Day 1 Test Checklist

1. Start the backend.
2. Open `http://127.0.0.1:8000/health`.
3. Confirm the backend returns `status: ok`.
4. Start the frontend.
5. Open `http://localhost:5173`.
6. Confirm the frontend shows `Connected`.
7. Run the frontend production build:

   ```powershell
   cd frontend
   npm.cmd run build
   ```

8. Confirm the build finishes without errors.

## Deployment Instructions

Deployment instructions will be added slowly as the project becomes ready for Render and Vercel.

For now, remember this simple idea:

- Render will host the backend API.
- Vercel will host the frontend website.
- Environment variables will connect the deployed frontend to the deployed backend.

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
