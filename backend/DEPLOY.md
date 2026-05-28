# Deploying the Backend

Quick steps to build and test the Docker image locally, and notes for common hosts.

Build locally
```bash
cd backend
docker build -t dtr-optimizer-backend .
docker run -p 8000:8000 dtr-optimizer-backend
# then visit http://localhost:8000/health
```

Render (recommended)
- Push repository to GitHub.
- Create a new Web Service on Render, connect the repo and select `Docker` as the build method. Set the health check path to `/health`.

Railway
- New Project → Deploy from GitHub. Railway detects Dockerfile; if not, set the start command to:
```
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Fly.io
- Install `flyctl`, run `fly launch` from `backend/` and follow prompts (it will use the Dockerfile).

Notes
- `osmnx` and geospatial packages require native libs; Dockerfile installs needed system packages.
- Ensure frontend (Vercel) uses the backend URL (set `VITE_API_URL` or similar env var in Vercel settings).
