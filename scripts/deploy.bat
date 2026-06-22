@echo off
cd /d C:\xampp\htdocs\SMS
echo ================================
echo   SMS - Push to GitHub
echo ================================

echo Current folder:
cd
echo.

echo Adding files...
git add .
echo.

set /p msg="Enter commit message: "

git commit -m "%msg%"
echo.

echo Pushing to GitHub...
git push origin main
echo.

echo ================================
echo   Done! Check GitHub Actions
echo ================================

pause