@echo off
REM deployment/deploy-infrastructure.bat
REM Deploys ECS Fargate infrastructure with RDS MySQL (Windows version)

echo Deploying Kids Piggy Bank Infrastructure to AWS...

REM Configuration
set STACK_NAME=KidsPiggyBankInfrastructure
set REGION=us-east-1
set TEMPLATE_FILE=deployment\ecs-fargate-infrastructure.yml

REM Check if AWS CLI is installed
aws --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  AWS CLI not found. Please install it first.
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
    for /f "delims=" %%i in ('powershell -ExecutionPolicy Bypass -File "deployment\generate-password.ps1" -Length 16') do set DB_PASSWORD=%%i
)
if "%JWT_SECRET%"=="" (
    for /f "delims=" %%i in ('powershell -ExecutionPolicy Bypass -File "deployment\generate-password.ps1" -Length 64') do set JWT_SECRET=%%i
)

echo  Configuration:
echo   Stack Name: %STACK_NAME%
echo   Region: %REGION%
echo   GitHub Owner: %GITHUB_OWNER%
echo   GitHub Repo: %GITHUB_REPO%
echo   Database Password: [HIDDEN]
echo   JWT Secret: [HIDDEN]

REM Deploy CloudFormation stack
echo   Deploying CloudFormation stack...
aws cloudformation deploy --template-file %TEMPLATE_FILE% --stack-name %STACK_NAME% --capabilities CAPABILITY_IAM --region %REGION% --parameter-overrides GitHubOwner="%GITHUB_OWNER%" GitHubRepo="%GITHUB_REPO%" GitHubBranch="main" GitHubToken="%GITHUB_TOKEN%" DBPassword="%DB_PASSWORD%" JWTSecret="%JWT_SECRET%" --no-fail-on-empty-changeset

if %errorlevel% neq 0 (
    echo  Infrastructure deployment failed!
    exit /b 1
)

echo ⏳ Waiting for stack deployment to complete...
aws cloudformation wait stack-create-complete --stack-name %STACK_NAME% --region %REGION%
if %errorlevel% neq 0 (
    aws cloudformation wait stack-update-complete --stack-name %STACK_NAME% --region %REGION%
)

if %errorlevel% equ 0 (
    echo  Infrastructure deployed successfully!
    
    REM Get outputs
    echo  Retrieving deployment outputs...
    for /f %%i in ('aws cloudformation describe-stacks --stack-name %STACK_NAME% --region %REGION% --query "Stacks[0].Outputs[?OutputKey=='LoadBalancerDNS'].OutputValue" --output text') do set LOAD_BALANCER_DNS=%%i
    for /f %%i in ('aws cloudformation describe-stacks --stack-name %STACK_NAME% --region %REGION% --query "Stacks[0].Outputs[?OutputKey=='DatabaseEndpoint'].OutputValue" --output text') do set DB_ENDPOINT=%%i
    for /f %%i in ('aws cloudformation describe-stacks --stack-name %STACK_NAME% --region %REGION% --query "Stacks[0].Outputs[?OutputKey=='ECRRepositoryURI'].OutputValue" --output text') do set ECR_URI=%%i
    
    echo.
    echo  Deployment Complete!
    echo ==================================
    echo Load Balancer DNS: %LOAD_BALANCER_DNS%
    echo Database Endpoint: %DB_ENDPOINT%
    echo ECR Repository URI: %ECR_URI%
    echo.
    echo  Update your mobile app configuration:
    echo    In mobile-ui\src\config\environment.js:
    echo    PROD_SERVER_URL = "http://%LOAD_BALANCER_DNS%:8080/api"
    echo.
    echo  Next steps:
    echo    1. Update mobile app with production URL
    echo    2. Build and deploy mobile app to Play Store
    echo    3. Push code to GitHub to trigger CI/CD pipeline
    echo.
    echo  Save these credentials securely:
    echo    Database Password: %DB_PASSWORD%
    echo    JWT Secret: %JWT_SECRET%
) else (
    echo  Infrastructure deployment failed!
    exit /b 1
)
