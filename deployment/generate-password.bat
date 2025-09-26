@echo off
REM deployment/generate-password.bat
REM Generates secure passwords that meet AWS requirements

REM Generate a secure password with at least 8 characters
REM Using a combination of letters, numbers, and special characters
powershell -command "$password = -join ((65..90) + (97..122) + (48..57) + (33..47) | Get-Random -Count 16 | %% {[char]$_}); $password"
