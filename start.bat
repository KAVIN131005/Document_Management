@echo off
echo Starting Document Management Dashboard...
echo.

REM Check if node_modules exist, if not install dependencies
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo.
echo Starting backend server...
start "Backend Server" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak

echo Starting frontend dev server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Application started!
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Make sure MongoDB is running before accessing the application.
echo You can start MongoDB with: docker-compose up -d mongodb
