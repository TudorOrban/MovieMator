@echo off
echo Attempting to stop Movie App backend (port 8080)...

rem Find PID for port 8080
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do (
    set "PID_BACKEND=%%a"
)

if defined PID_BACKEND (
    echo Found backend process with PID: %PID_BACKEND%. Terminating...
    taskkill /PID %PID_BACKEND% /F
    echo Spring Boot backend stopped.
) else (
    echo Spring Boot backend not found or not running on port 8080.
)

echo.
echo Attempting to stop Movie App frontend (port 4200)...

rem Find PID for port 4200
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4200') do (
    set "PID_FRONTEND=%%a"
)

if defined PID_FRONTEND (
    echo Found frontend process with PID: %PID_FRONTEND%. Terminating...
    taskkill /PID %PID_FRONTEND% /F
    echo Angular frontend stopped.
) else (
    echo Angular frontend not found or not running on port 4200.
)

echo.
echo All efforts to stop the applications have been completed.
pause