@echo off
REM deploy-free-tier.bat
REM Deploy Kids Piggy Bank using AWS Free Tier resources

echo Kids Piggy Bank - AWS Free Tier Deployment
echo ==========================================

REM Configuration
set STACK_NAME=KidsPiggyBankFreeTier
set REGION=ap-south-1
set TEMPLATE_FILE=deployment\ec2-free-tier-infrastructure.yml

REM Check if AWS CLI is installed
aws --version >nul 2>&1
if %errorlevel% neq 0 (
    echo AWS CLI not found. Please install it first.
    exit /b 1
)

REM Check if AWS is configured
aws sts get-caller-identity >nul 2>&1
if %errorlevel% neq 0 (
    echo AWS CLI not configured. Please run 'aws configure' first.
    exit /b 1
)

REM Get user input
echo.
echo Please provide the following information:
set /p KEY_PAIR_NAME="EC2 Key Pair Name (for SSH access): "
set /p DB_PASSWORD="Database Password (min 8 chars): "
set /p JWT_SECRET="JWT Secret (min 32 chars): "

REM Validate inputs
if "%KEY_PAIR_NAME%"=="" (
    echo EC2 Key Pair Name is required!
    exit /b 1
)
if "%DB_PASSWORD%"=="" (
    echo Database Password is required!
    exit /b 1
)
if "%JWT_SECRET%"=="" (
    echo JWT Secret is required!
    exit /b 1
)

echo.
echo Deploying Free Tier infrastructure...
echo This will create:
echo - EC2 t2.micro instance (FREE)
echo - RDS db.t3.micro database (FREE)
echo - VPC and Security Groups (FREE)
echo - Estimated cost: $0.00/day

aws cloudformation deploy --template-file %TEMPLATE_FILE% --stack-name %STACK_NAME% --capabilities CAPABILITY_IAM --region %REGION% --parameter-overrides KeyPairName="%KEY_PAIR_NAME%" DBPassword="%DB_PASSWORD%" JWTSecret="%JWT_SECRET%" --no-fail-on-empty-changeset

if %errorlevel% neq 0 (
    echo Infrastructure deployment failed!
    exit /b 1
)

echo.
echo Deployment completed successfully!
echo.
echo Next steps:
echo 1. SSH into your EC2 instance
echo 2. Deploy your Spring Boot application
echo 3. Update mobile app to use EC2 public IP
echo.
echo Your resources are now running on AWS Free Tier!

exit /b 0
