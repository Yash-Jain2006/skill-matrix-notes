# SkillNotes SaaS - Phase 1 MVP

This is an enterprise-grade scalable Notes SaaS platform built with React, FastAPI, and Supabase. It strictly follows Clean Architecture principles, ensuring that business logic is fully decoupled from routing and database operations.

## Architecture

- **Frontend**: React SPA (Vite), Tailwind CSS, React Query, Axios.
- **Backend**: Python FastAPI, strictly typed with Pydantic, decoupled Routers/Services/Repositories.
- **Database/Storage**: Supabase PostgreSQL + Supabase Storage (S3-compatible).
- **Security**: Supabase Auth handles logins, backend verifies incoming JWTs asynchronously via Supabase JWKS endpoints. Row-level security (RLS) restricts data down to the database connection level.

---

## 🚀 Setup Guide (Local Development)

### 1. Supabase Initialization
1. Create a free project at [Supabase](https://supabase.com/).
2. Navigate to **SQL Editor** and paste the entire contents of `database/schema.sql`. Run it.
3. This will create your `notes` table, setup `notes-files` storage bucket, and apply all critical RLS policies.

### 2. Backend Setup
1. CD into the backend directory:
   ```bash
   cd backend
   ```
2. Create your virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the `backend/` directory:
   ```env
   SUPABASE_URL=https://<YOUR-PROJECT>.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<YOUR-SERVICE-ROLE-KEY>
   ```
4. Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
5. Check health status at `http://localhost:8000/health`.

### 3. Frontend Setup
1. CD into the frontend directory:
   ```bash
   cd frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_SUPABASE_URL=https://<YOUR-PROJECT>.supabase.co
   VITE_SUPABASE_ANON_KEY=<YOUR-ANON-KEY>
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

---

## 🌍 Deployment Guide (Free Tier)

### Deploying the Database (Supabase)
Your database is naturally hosted by Supabase. Ensure you do not expose your `SERVICE_ROLE_KEY` to the internet. Keep it strictly inside the Backend environment variables.

### Deploying the Backend (Render)
Render offers a free tier for Python web services.
1. Connect your GitHub repository to Render and create a **New Web Service**.
2. **Root Directory**: `backend`
3. **Runtime**: `Python 3`
4. **Build Command**: `pip install -r requirements.txt`
5. **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add your Environment Variables: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

### Deploying the Frontend (Vercel)
Vercel is the optimal host for Vite-based SPAs.
1. Connect your repo in Vercel and **Import Project**.
2. **Root Directory**: `frontend`
3. **Framework Preset**: `Vite`
4. Add Environment Variables: 
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_BASE_URL` (Set this to the actual Render backend URL, e.g. `https://skillnotes-api.onrender.com/api/v1`)
5. Deploy.

---

## Clean Architecture Reference

If adding a new domain (e.g., `Profiles`), follow this strict layer sequence inside `/backend/app`:
1. Define the SQL schema + RLS.
2. Define Pydantic models in `/schemas/profile.py`.
3. Create `/repositories/profile_repository.py` (Supabase driver logic).
4. Create `/services/profile_service.py` (Business logic, permissions).
5. Create `/api/v1/endpoints/profiles.py` (HTTP endpoints).
6. Inject Service into Endpoint via `Depends()`.