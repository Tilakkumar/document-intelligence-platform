@echo off
echo 🚀 Starting Document Intelligence Platform on Windows...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed or not in PATH.
    echo    Please install Docker Desktop for Windows from:
    echo    https://www.docker.com/products/docker-desktop-windows
    pause
    exit /b 1
)

REM Check if Docker is running
docker system info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop.
    echo    You can start it from the Start Menu or Desktop shortcut.
    pause
    exit /b 1
)

REM Check if docker-compose is available
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not available. Please ensure Docker Desktop is properly installed.
    pause
    exit /b 1
)

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please edit the .env file and add your OpenAI API key before proceeding.
    echo    You can edit it with: notepad .env
    pause
)

REM Check for port conflicts
echo 🔍 Checking for port conflicts...
for %%p in (3000 8080 27017 6379 9200) do (
    netstat -an | findstr :%%p >nul 2>&1
    if !errorlevel! equ 0 (
        echo ⚠️  Warning: Port %%p is already in use
    )
)

REM Pull latest images
echo 📦 Pulling latest Docker images...
docker-compose pull

REM Start the platform
echo 🌟 Starting Document Intelligence Platform...
docker-compose up -d

REM Wait for services to start
echo ⏳ Waiting for services to start...
timeout /t 15 >nul

REM Check service health
echo 🏥 Checking service health...
set HEALTHY=true

for %%s in (frontend backend mongo redis elasticsearch tika) do (
    docker-compose ps %%s | findstr "Up" >nul 2>&1
    if !errorlevel! neq 0 (
        echo ❌ %%s is not running properly
        set HEALTHY=false
    ) else (
        echo ✅ %%s is running
    )
)

if "%HEALTHY%"=="true" (
    echo.
    echo 🎉 Document Intelligence Platform is now running!
    echo.
    echo 📊 Access your services:
    echo    🌐 Web Interface:      http://localhost:3000
    echo    🔧 API Documentation:  http://localhost:8080/swagger-ui.html
    echo    📈 Grafana Dashboard:  http://localhost:3001 ^(admin/admin123^)
    echo    📊 Prometheus:         http://localhost:9090
    echo.
    echo 📋 Useful commands:
    echo    View logs:    docker-compose logs -f
    echo    Stop platform: docker-compose down
    echo    Restart:      docker-compose restart
    echo.
    
    REM Ask if user wants to open the web interface
    set /p OPEN_BROWSER="Would you like to open the web interface now? (y/n): "
    if /i "%OPEN_BROWSER%"=="y" (
        start http://localhost:3000
    )
) else (
    echo.
    echo ❌ Some services failed to start properly.
    echo 📋 Check the logs with: docker-compose logs
    echo 🔄 You can try restarting with: docker-compose restart
)

pause