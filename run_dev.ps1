# Omni-Logistics Master Agent Launcher for Windows PowerShell
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   OMNI-LOGISTICS MASTER AGENT - AUTONOMOUS CONTROL TOWER   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Start FastAPI Backend
Write-Host "[1/2] Starting FastAPI Backend on http://localhost:8000..." -ForegroundColor Yellow
$BackendJob = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd 'backend'; .\.venv\Scripts\activate; uvicorn app.main:app --reload --port 8000" -PassThru

# Wait 2 seconds for backend to bind port
Start-Sleep -Seconds 2

# 2. Start Next.js Frontend
Write-Host "[2/2] Starting Next.js 14 Control Tower on http://localhost:3000..." -ForegroundColor Green
$FrontendJob = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd 'frontend'; npm run dev" -PassThru

Write-Host "`nAll services launched successfully!" -ForegroundColor Cyan
Write-Host "Backend API docs: http://localhost:8000/docs" -ForegroundColor Gray
Write-Host "Control Tower UI: http://localhost:3000" -ForegroundColor Gray
Write-Host "Press Ctrl+C in their respective windows to stop." -ForegroundColor Gray
