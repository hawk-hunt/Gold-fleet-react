@echo off
REM Gold Fleet Project Setup Script (Windows)
REM Configures both backend Laravel and frontend React environments

setlocal enabledelayedexpansion

set PROJECT_ROOT=%~dp0
set BACKEND_DIR=%PROJECT_ROOT%backend
set FRONTEND_DIR=%PROJECT_ROOT%frontend

cls
echo ==========================================
echo Gold Fleet Setup Script (Windows)
echo ==========================================
echo.

REM Check prerequisites
echo Checking prerequisites...
where php >nul 2>nul || (
    echo [ERROR] PHP is not installed or not in PATH
    exit /b 1
)
where composer >nul 2>nul || (
    echo [ERROR] Composer is not installed or not in PATH
    exit /b 1
)
where node >nul 2>nul || (
    echo [ERROR] Node.js is not installed or not in PATH
    exit /b 1
)
where npm >nul 2>nul || (
    echo [ERROR] npm is not installed or not in PATH
    exit /b 1
)
echo [OK] All prerequisites installed
echo.

REM Backend Setup
echo ========== BACKEND SETUP (Laravel) ==========
cd /d "%BACKEND_DIR%"

if not exist "composer.lock" (
    echo Installing Composer dependencies...
    call composer install --no-interaction
    if errorlevel 1 (
        echo [ERROR] Composer install failed
        exit /b 1
    )
) else (
    echo Composer dependencies already installed
)

if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    call php artisan key:generate
    if errorlevel 1 (
        echo [ERROR] Failed to generate app key
        exit /b 1
    )
) else (
    echo .env file already exists
)

echo Running migrations...
call php artisan migrate --force
if errorlevel 1 (
    echo [WARNING] Migrations may already be applied or had an error
)

echo [OK] Backend setup complete
echo.

REM Frontend Setup
echo ========== FRONTEND SETUP (React) ==========
cd /d "%FRONTEND_DIR%"

if not exist "node_modules" (
    echo Installing npm dependencies...
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed
        exit /b 1
    )
) else (
    echo npm dependencies already installed
)

echo [OK] Frontend setup complete
echo.

REM Summary
echo ========== SETUP COMPLETE ==========
echo.
echo To start the application:
echo.
echo   Backend (Laravel):
echo     cd %BACKEND_DIR%
echo     php artisan serve
echo     Runs on: http://localhost:8000
echo.
echo   Frontend (React):
echo     cd %FRONTEND_DIR%
echo     npm run dev
echo     Runs on: http://localhost:5173
echo.
echo [WARNING] Make sure both servers are running!
echo.
echo Documentation:
echo   - README.md                 - Project overview and setup
echo   - IMPLEMENTATION_GUIDE.md   - Component patterns and guide
echo   - MIGRATION_CHECKLIST.md    - Blade to React migration steps
echo.
pause
