@echo off
echo 🚀 Setting up BlogWeb - Modern Blogging Platform
echo ================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js (v14 or higher) first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if MongoDB is available
mongod --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️ MongoDB is not installed or not in PATH.
    echo    Please install MongoDB and make sure it's running.
    echo    Download from: https://www.mongodb.com/try/download/community
)

echo 📦 Installing Backend Dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

echo 🔧 Setting up Backend Environment...
if not exist .env (
    copy .env.example .env
    echo ✅ Created .env file from template
    echo ⚠️ Please update the .env file with your actual configuration
) else (
    echo ✅ .env file already exists
)

echo 📦 Installing Frontend Dependencies...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo 🎉 Setup Complete!
echo.
echo 📋 Next Steps:
echo 1. Update backend/.env with your MongoDB URI and JWT secret
echo 2. Start MongoDB service on your system
echo 3. Run the following commands in separate terminals:
echo.
echo    Terminal 1 (Backend):
echo    cd backend ^&^& npm run dev
echo.
echo    Terminal 2 (Frontend):
echo    cd frontend ^&^& npm start
echo.
echo 4. Open http://localhost:3000 in your browser
echo.
echo 🎊 Happy Blogging!
pause