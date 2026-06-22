@echo off
echo ================================
echo   SMS - First Setup
echo ================================

echo [1/4] Initializing Git...
git init
git branch -M main

set /p remote="Enter your GitHub repo URL: "
git remote add origin %remote%

echo [2/4] Installing dependencies...
call npm install

echo [3/4] Creating .gitignore...
echo node_modules/ >> .gitignore
echo android/build/ >> .gitignore
echo android/.gradle/ >> .gitignore
echo ios/build/ >> .gitignore
echo .env >> .gitignore
echo *.keystore >> .gitignore

echo [4/4] First push to GitHub...
git add .
git commit -m "Initial commit"
git push -u origin main

echo ================================
echo   Setup Complete!
echo ================================
pause