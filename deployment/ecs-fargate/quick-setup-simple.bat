@echo off
REM quick-setup-simple.bat
REM Simple version without complex commands

echo Kids Piggy Bank - AWS ECS Fargate Quick Setup
echo ================================================

REM Check prerequisites
echo Checking prerequisites...

REM Check AWS CLI
aws --version >nul 2>&1
if %errorlevel% neq 0 (
    echo AWS CLI not found. Please install it first:
    echo    https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
    exit /b 1
)

REM Check if AWS is configured
aws sts get-caller-identity >nul 2>&1
if %errorlevel% neq 0 (
    echo AWS CLI not configured. Please run 'aws configure' first.
    exit /b 1
)

echo Prerequisites check passed!

REM Get user input
echo.
echo Please provide the following information:
set /p GITHUB_USERNAME="GitHub Username: "
set /p GITHUB_REPO="GitHub Repository Name: "
set /p GITHUB_TOKEN="GitHub Personal Access Token: "

REM Validate inputs
if "%GITHUB_USERNAME%"=="" (
    echo GitHub Username is required!
    exit /b 1
)
if "%GITHUB_REPO%"=="" (
    echo GitHub Repository Name is required!
    exit /b 1
)
if "%GITHUB_TOKEN%"=="" (
    echo GitHub Personal Access Token is required!
    exit /b 1
)

REM Test GitHub token
echo Testing GitHub token...
curl -s -H "Authorization: token %GITHUB_TOKEN%" "https://api.github.com/user" | findstr "login" >nul
if %errorlevel% neq 0 (
    echo Invalid GitHub token. Please check your token permissions.
    exit /b 1
)
echo GitHub token is valid!

REM Generate secure passwords
echo Generating secure credentials...
set DB_PASSWORD=TestPass123456789
set JWT_SECRET=TestJWTSecret123456789012345678901234567890123456789012345678901234567890

echo Credentials generated!

REM Deploy infrastructure
echo.
echo Deploying AWS infrastructure...
call deployment\deploy-infrastructure-simple.bat "%GITHUB_USERNAME%" "%GITHUB_REPO%" "%GITHUB_TOKEN%" "%DB_PASSWORD%" "%JWT_SECRET%"

if %errorlevel% neq 0 (
    echo Infrastructure deployment failed!
    exit /b 1
)

echo.
echo Deployment completed successfully!
echo.
echo Next steps:
echo 1. Check AWS Console for your resources
echo 2. Update your mobile app configuration
echo 3. Build and deploy your mobile app

exit /b 0
