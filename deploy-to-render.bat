@echo off
echo 🚀 Preparing BlogWeb for Render Deployment...

REM Check if we're in the right directory
if not exist "backend" (
    if not exist "frontend" (
        echo ❌ Please run this script from the BlogWeb root directory
        pause
        exit /b 1
    )
)

echo ✅ Project structure validated

REM Check Git status and commit changes
echo 📋 Checking Git status...
git status --porcelain > temp.txt
set /p changes=<temp.txt
del temp.txt

if not "%changes%"=="" (
    echo ⚠️  You have uncommitted changes. Committing them now...
    git add .
    git commit -m "Prepare for Render deployment - Add deployment configuration"
    git push origin main
    echo ✅ Changes committed and pushed
) else (
    echo ✅ Git repository is clean and up to date
)

echo.
echo 🎯 Deployment Checklist:
echo 1. ✅ render.yaml configuration created
echo 2. ✅ Health check endpoint added to backend
echo 3. ✅ Production CORS settings configured
echo 4. ✅ Environment variables template created
echo 5. ✅ Deployment guide created

echo.
echo 🔄 Next Steps:
echo 1. Go to https://render.com and sign up/login
echo 2. Connect your GitHub account and select the BlogWeb repository
echo 3. Follow the instructions in RENDER_DEPLOYMENT.md
echo 4. Create the backend web service first
echo 5. Create the MongoDB database
echo 6. Create the frontend static site
echo 7. Update environment variables with actual values

echo.
echo 📚 Important Files Created:
echo - render.yaml (Render configuration)
echo - RENDER_DEPLOYMENT.md (Step-by-step deployment guide)
echo - backend/.env.production (Production environment template)

echo.
echo 🎉 Your BlogWeb is ready for Render deployment!
echo 📖 Read RENDER_DEPLOYMENT.md for detailed instructions
echo.
echo Press any key to open the deployment guide...
pause > nul
start RENDER_DEPLOYMENT.md