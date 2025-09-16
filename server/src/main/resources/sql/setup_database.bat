@echo off
echo Setting up Kids Piggy Bank MySQL Database...
echo.

REM Check if MySQL is in PATH first
mysql --version >nul 2>&1
if %errorlevel% equ 0 (
    echo MySQL found in PATH
    set MYSQL_CMD=mysql
    goto :execute
)

REM If not in PATH, try common locations
if exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" (
    echo MySQL found at: C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
    set MYSQL_CMD="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
    goto :execute
)

if exist "C:\Program Files\MySQL\MySQL Server 8.1\bin\mysql.exe" (
    echo MySQL found at: C:\Program Files\MySQL\MySQL Server 8.1\bin\mysql.exe
    set MYSQL_CMD="C:\Program Files\MySQL\MySQL Server 8.1\bin\mysql.exe"
    goto :execute
)

if exist "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe" (
    echo MySQL found at: C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe
    set MYSQL_CMD="C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe"
    goto :execute
)

echo Error: MySQL not found
echo Please ensure MySQL is installed and in PATH
echo Or update this script with the correct MySQL path
pause
exit /b 1

:execute
echo Proceeding with database setup...
echo.

echo Creating database...
%MYSQL_CMD% -u root -p < 01_create_database.sql

echo Creating tables...
%MYSQL_CMD% -u root -p piggy_bank < 02_create_tables.sql

echo Creating indexes...
%MYSQL_CMD% -u root -p piggy_bank < 03_create_indexes.sql

echo Inserting sample data...
%MYSQL_CMD% -u root -p piggy_bank < 04_sample_data.sql

echo.
echo Database setup completed successfully!
echo Database: piggy_bank
echo Tables: users, kids, and audit tables
echo.
pause
