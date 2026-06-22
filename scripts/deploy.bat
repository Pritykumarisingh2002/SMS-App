@echo off
echo ================================
echo   SMS - Deploy Script
echo ================================

echo [1/5] Pulling latest changes...
git pull origin main

echo [2/5] Installing dependencies...
call npm install

echo [3/5] Building Android APK...
cd android
call gradlew assembleRelease
cd ..

echo [4/5] Copying APK to output folder...
if not exist "output" mkdir output
copy android\app\build\outputs\apk\release\app-release.apk output\SMS.apk

echo [5/5] Pushing to GitHub...
git add .
set /p msg="Enter commit message: "
git commit -m "%msg%"
git push origin main

echo ================================
echo   Done! APK saved in /output
echo ================================
pause