@echo off
REM deployment/deploy-infrastructure-simple.bat
REM Simple version without complex commands

echo Deploying Kids Piggy Bank Infrastructure to AWS...

REM Configuration
set STACK_NAME=KidsPiggyBankInfrastructure
set REGION=us-east-1
set TEMPLATE_FILE=deployment\ecs-fargate-infrastructure.yml

REM Check if AWS CLI is installed
aws --version >nul 2>&1
if %errorlevel% neq 0 (
    echo AWS CLI not found. Please install it first.
    exit /b 1
)

REM Check if parameters are provided
if "%1"=="" (
    echo Usage: %0 ^<GitHubOwner^> ^<GitHubRepo^> ^<GitHubToken^> [DBPassword] [JWTSecret]
    echo Example: %0 yourusername kids-piggy-bank-expo ghp_xxxxxxxxxxxx
    exit /b 1
)

set GITHUB_OWNER=%1
set GITHUB_REPO=%2
set GITHUB_TOKEN=%3
set DB_PASSWORD=%4
set JWT_SECRET=%5

REM Generate passwords if not provided
if "%DB_PASSWORD%"=="" (
    set DB_PASSWORD=TestPass123456789
)
if "%JWT_SECRET%"=="" (
    set JWT_SECRET=TestJWTSecret123456789012345678901234567890123456789012345678901234567890
)

echo Configuration:
echo   Stack Name: %STACK_NAME%
echo   Region: %REGION%
echo   GitHub Owner: %GITHUB_OWNER%
echo   GitHub Repo: %GITHUB_REPO%
echo   Database Password: [HIDDEN]
echo   JWT Secret: [HIDDEN]

REM Deploy CloudFormation stack
echo Deploying CloudFormation stack...
aws cloudformation deploy --template-file %TEMPLATE_FILE% --stack-name %STACK_NAME% --capabilities CAPABILITY_IAM --region %REGION% --parameter-overrides GitHubOwner="%GITHUB_OWNER%" GitHubRepo="%GITHUB_REPO%" GitHubBranch="main" GitHubToken="%GITHUB_TOKEN%" DBPassword="%DB_PASSWORD%" JWTSecret="%JWT_SECRET%" --no-fail-on-empty-changeset

if %errorlevel% neq 0 (
    echo Infrastructure deployment failed!
    exit /b 1
)

echo Infrastructure deployment completed successfully!
echo.
echo Next steps:
echo 1. Check AWS Console for your resources
echo 2. Run the pipeline deployment script
echo 3. Update your mobile app configuration

exit /b 0
