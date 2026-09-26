@echo off
setlocal EnableExtensions
set "APP_HOME=%~dp0"
set "PROPS=%APP_HOME%gradle\wrapper\gradle-wrapper.properties"
for /f "tokens=1,* delims==" %%A in ('findstr /b "distributionUrl=" "%PROPS%"') do set "DIST_URL=%%B"
set "DIST_URL=%DIST_URL:\: =:%"
set "DIST_URL=%DIST_URL:\=:%"
for %%F in ("%DIST_URL%") do set "DIST_NAME=%%~nxF"
set "GRADLE_VERSION=%DIST_NAME:gradle-=%"
set "GRADLE_VERSION=%GRADLE_VERSION:-bin.zip=%"
set "CACHE=%USERPROFILE%\.gradle\wrapper\dists\magnet-gradle-%GRADLE_VERSION%"
set "DIST_ZIP=%CACHE%\%DIST_NAME%"
set "DIST_HOME=%CACHE%\gradle-%GRADLE_VERSION%"
if not exist "%DIST_HOME%\bin\gradle.bat" (
  if not exist "%CACHE%" mkdir "%CACHE%"
  if not exist "%DIST_ZIP%" powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -UseBasicParsing -Uri '%DIST_URL%' -OutFile '%DIST_ZIP%'"
  if exist "%DIST_HOME%" rmdir /s /q "%DIST_HOME%"
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Force '%DIST_ZIP%' '%CACHE%'"
)
call "%DIST_HOME%\bin\gradle.bat" %*
exit /b %ERRORLEVEL%
