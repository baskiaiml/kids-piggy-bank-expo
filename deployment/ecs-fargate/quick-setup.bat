@echo off
REM quick-setup.bat
REM One-click setup for AWS ECS Fargate deployment (Windows version)

echo  Kids Piggy Bank - AWS ECS Fargate Quick Setup
echo ================================================

REM Check prerequisites
echo  Checking prerequisites...

REM Check AWS CLI
aws --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  AWS CLI not found. Please install it first:
    echo    https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
    exit /b 1
)

REM Check if AWS is configured
aws sts get-caller-identity >nul 2>&1
if %errorlevel% neq 0 (
    echo  AWS CLI not configured. Please run 'aws configure' first.
    exit /b 1
)

echo  Prerequisites check passed!

REM Get user input
echo.
echo Please provide the following information:
echo.

set /p GITHUB_USERNAME="GitHub Username: "
set /p GITHUB_REPO="GitHub Repository Name: "
set /p GITHUB_TOKEN="GitHub Personal Access Token: "

REM Validate inputs
if "%GITHUB_USERNAME%"=="" (
    echo  GitHub Username is required!
    exit /b 1
)
if "%GITHUB_REPO%"=="" (
    echo  GitHub Repository Name is required!
    exit /b 1
)
if "%GITHUB_TOKEN%"=="" (
    echo  GitHub Personal Access Token is required!
    exit /b 1
)

REM Test GitHub token
echo  Testing GitHub token...
curl -s -H "Authorization: token %GITHUB_TOKEN%" "https://api.github.com/user" | findstr "login" >nul
if %errorlevel% neq 0 (
    echo  Invalid GitHub token. Please check your token permissions.
    exit /b 1
)
echo GitHub token is valid!

REM Generate secure passwords
echo  Generating secure credentials...
for /f "delims=" %%i in ('powershell -ExecutionPolicy Bypass -File "deployment\generate-password.ps1" -Length 16') do set DB_PASSWORD=%%i
for /f "delims=" %%i in ('powershell -ExecutionPolicy Bypass -File "deployment\generate-password.ps1" -Length 64') do set JWT_SECRET=%%i

echo  Credentials generated!

REM Deploy infrastructure
echo.
echo   Deploying AWS infrastructure...
echo This may take 10-15 minutes...

call deployment\deploy-infrastructure.bat "%GITHUB_USERNAME%" "%GITHUB_REPO%" "%GITHUB_TOKEN%" "%DB_PASSWORD%" "%JWT_SECRET%"
if %errorlevel% neq 0 (
    echo  Infrastructure deployment failed!
    exit /b 1
)

REM Get infrastructure outputs
echo Getting infrastructure outputs...
set STACK_NAME=KidsPiggyBankInfrastructure
set REGION=ap-south-1

for /f "delims=" %%i in ('aws cloudformation describe-stacks --stack-name %STACK_NAME% --region %REGION% --query "Stacks[0].Outputs[?OutputKey==`LoadBalancerDNS`].OutputValue" --output text') do set LOAD_BALANCER_DNS=%%i
for /f "delims=" %%i in ('aws cloudformation describe-stacks --stack-name %STACK_NAME% --region %REGION% --query "Stacks[0].Outputs[?OutputKey==`ECRRepositoryURI`].OutputValue" --output text') do set ECR_URI=%%i
for /f "delims=" %%i in ('aws cloudformation describe-stacks --stack-name %STACK_NAME% --region %REGION% --query "Stacks[0].Outputs[?OutputKey==`ECSClusterName`].OutputValue" --output text') do set ECS_CLUSTER=%%i

REM Deploy pipeline
echo.
echo Deploying CI/CD pipeline...

call deployment\deploy-pipeline.bat "%GITHUB_USERNAME%" "%GITHUB_REPO%" "%GITHUB_TOKEN%" "%ECR_URI%" "%ECS_CLUSTER%" "piggy-bank-dev-service" "piggy-bank-prod-service"
if %errorlevel% neq 0 (
    echo  Pipeline deployment failed!
    exit /b 1
)

REM Update mobile app configuration
echo.
echo 📱 Updating mobile app configuration...

REM Create backup of environment.js
copy mobile-ui\src\config\environment.js mobile-ui\src\config\environment.js.backup

REM Update environment.js with production URL
powershell -command "(Get-Content 'mobile-ui\src\config\environment.js') -replace 'http://your-alb-dns-name.elb.amazonaws.com:8080/api', 'http://%LOAD_BALANCER_DNS%:8080/api' | Set-Content 'mobile-ui\src\config\environment.js'"

echo Mobile app configuration updated!

REM Create credentials file
echo.
echo  Saving credentials...
echo # Kids Piggy Bank - AWS Deployment Credentials > deployment\credentials.txt
echo # Generated on: %date% %time% >> deployment\credentials.txt
echo. >> deployment\credentials.txt
echo ## Database Credentials >> deployment\credentials.txt
echo Database Password: %DB_PASSWORD% >> deployment\credentials.txt
echo. >> deployment\credentials.txt
echo ## JWT Secret >> deployment\credentials.txt
echo JWT Secret: %JWT_SECRET% >> deployment\credentials.txt
echo. >> deployment\credentials.txt
echo ## AWS Resources >> deployment\credentials.txt
echo Load Balancer DNS: %LOAD_BALANCER_DNS% >> deployment\credentials.txt
echo ECR Repository URI: %ECR_URI% >> deployment\credentials.txt
echo ECS Cluster Name: %ECS_CLUSTER% >> deployment\credentials.txt
echo. >> deployment\credentials.txt
echo ## API URLs >> deployment\credentials.txt
echo Dev Environment: http://%LOAD_BALANCER_DNS%/api >> deployment\credentials.txt
echo Production Environment: http://%LOAD_BALANCER_DNS%:8080/api >> deployment\credentials.txt
echo. >> deployment\credentials.txt
echo ## Mobile App Configuration >> deployment\credentials.txt
echo Update mobile-ui\src\config\environment.js: >> deployment\credentials.txt
echo PROD_SERVER_URL = "http://%LOAD_BALANCER_DNS%:8080/api" >> deployment\credentials.txt
echo. >> deployment\credentials.txt
echo ## Next Steps >> deployment\credentials.txt
echo 1. Push your code to GitHub to trigger the first build >> deployment\credentials.txt
echo 2. Monitor the pipeline in AWS CodePipeline console >> deployment\credentials.txt
echo 3. Build your mobile app: cd mobile-ui ^&^& eas build --platform android --profile production >> deployment\credentials.txt
echo 4. Upload APK to Google Play Console >> deployment\credentials.txt
echo. >> deployment\credentials.txt
echo ## Important >> deployment\credentials.txt
echo - Keep these credentials secure >> deployment\credentials.txt
echo - The pipeline will automatically deploy to dev on code push >> deployment\credentials.txt
echo - Manual approval required for production deployment >> deployment\credentials.txt

echo Credentials saved to deployment\credentials.txt

REM Final summary
echo.
echo Setup Complete!
echo ==================
echo.
echo  Deployment Summary:
echo   Load Balancer: %LOAD_BALANCER_DNS%
echo   ECR Repository: %ECR_URI%
echo   ECS Cluster: %ECS_CLUSTER%
echo.
echo  Important Links:
echo   AWS Console: https://console.aws.amazon.com
echo   CodePipeline: https://console.aws.amazon.com/codesuite/codepipeline
echo   ECS Console: https://console.aws.amazon.com/ecs
echo.
echo Mobile App URLs:
echo   Dev Environment: http://%LOAD_BALANCER_DNS%/api
echo   Production: http://%LOAD_BALANCER_DNS%:8080/api
echo.
echo  Next Steps:
echo   1. Push code to GitHub: git push origin main
echo   2. Monitor pipeline in AWS console
echo   3. Build mobile app: cd mobile-ui ^&^& eas build --platform android --profile production
echo   4. Upload APK to Google Play Console
echo.
echo  Full documentation: AWS_DEPLOYMENT_GUIDE.md
echo  Credentials saved: deployment\credentials.txt
echo.
echo Happy coding!
pause
