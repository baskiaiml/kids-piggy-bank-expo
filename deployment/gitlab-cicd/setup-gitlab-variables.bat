@echo off
REM setup-gitlab-variables.bat
REM Helper script to set up GitLab CI/CD variables

echo GitLab CI/CD Variables Setup Helper
echo ===================================

echo.
echo This script will help you gather the information needed for GitLab CI/CD variables.
echo.
echo Please have the following ready:
echo 1. Your GitLab project URL
echo 2. EC2 instance public IP
echo 3. SSH private key file
echo 4. RDS endpoint
echo 5. Database password
echo 6. JWT secret
echo.

set /p GITLAB_URL="Enter your GitLab project URL (e.g., https://gitlab.com/username/repo): "
set /p EC2_IP="Enter your EC2 public IP: "
set /p SSH_KEY_FILE="Enter path to your SSH private key file: "
set /p RDS_ENDPOINT="Enter your RDS endpoint: "
set /p DB_PASSWORD="Enter your database password: "
set /p JWT_SECRET="Enter your JWT secret: "

echo.
echo ========================================
echo GitLab CI/CD Variables to Add:
echo ========================================
echo.
echo Go to: %GITLAB_URL%/-/settings/ci_cd
echo.
echo Add these variables:
echo.
echo Variable Name: EC2_HOST
echo Variable Value: %EC2_IP%
echo Protected: Yes
echo Masked: No
echo.
echo Variable Name: SSH_PRIVATE_KEY
echo Variable Value: [Content of %SSH_KEY_FILE%]
echo Protected: Yes
echo Masked: Yes
echo.
echo Variable Name: DB_HOST
echo Variable Value: %RDS_ENDPOINT%
echo Protected: Yes
echo Masked: No
echo.
echo Variable Name: DB_PASSWORD
echo Variable Value: %DB_PASSWORD%
echo Protected: Yes
echo Masked: Yes
echo.
echo Variable Name: JWT_SECRET
echo Variable Value: %JWT_SECRET%
echo Protected: Yes
echo Masked: Yes
echo.
echo ========================================
echo SSH Key Content:
echo ========================================
echo.
if exist "%SSH_KEY_FILE%" (
    echo Copy this content for SSH_PRIVATE_KEY variable:
    echo.
    type "%SSH_KEY_FILE%"
) else (
    echo SSH key file not found: %SSH_KEY_FILE%
    echo Please check the path and try again.
)

echo.
echo ========================================
echo Next Steps:
echo ========================================
echo.
echo 1. Add the variables to GitLab CI/CD settings
echo 2. Push your code to GitLab repository
echo 3. Check the pipeline runs in GitLab UI
echo 4. Monitor deployments in CI/CD section
echo.
echo For detailed setup instructions, see: GITLAB_CI_SETUP.md
echo.

pause
