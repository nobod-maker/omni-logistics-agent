@echo off
echo ==========================================================
echo    OMNI-LOGISTICS MASTER AGENT - AUTONOMOUS CONTROL TOWER   
echo ==========================================================

echo [1/2] Starting FastAPI Backend on http://localhost:8000...
start "Omni-Logistics Backend" cmd /k "cd backend && call .venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

timeout /t 2 /nobreak > nul

echo [2/2] Starting Next.js Frontend on http://localhost:3000...
start "Omni-Logistics Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Systems launching in separate consoles!
echo UI: http://localhost:3000
echo API: http://localhost:8000/docs
echo.
