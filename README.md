# LearnLoop AI

LearnLoop AI is a learning platform for interview practice and AI coaching. This Phase 1 setup includes the landing page and a basic Express backend health-check endpoint.

## Project structure

- `frontend/` - landing page HTML, CSS, and JavaScript
- `backend/` - Node.js and Express backend
- `.env.example` - sample environment variables

## Local setup

### 1) Install backend dependencies

Open PowerShell and run:

```powershell
cd "C:\Users\Sakshi\OneDrive\Desktop\vortexa\backend"
npm install
```

### 2) Start the backend

```powershell
cd "C:\Users\Sakshi\OneDrive\Desktop\vortexa\backend"
npm start
```

### 3) Open the frontend

You can open the landing page directly in a browser:

```powershell
start "" "C:\Users\Sakshi\OneDrive\Desktop\vortexa\frontend\index.html"
```

Or open the `frontend` folder in VS Code and launch `index.html` from there.

## Health check

Once the backend is running, test it with:

```powershell
curl.exe http://localhost:3000/api/health
```

Expected JSON response:

```json
{"status":"ok","message":"LearnLoop AI backend is running","timestamp":"2026-10-11T12:29:10.704Z"}
```

## Notes

- This is Phase 1 only.
- MongoDB, Gemini, and interview features are intentionally not implemented yet.
- Pyodide browser code execution is planned for a later phase.
