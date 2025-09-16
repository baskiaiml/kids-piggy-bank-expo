#!/bin/bash

echo "Setting up Kids Piggy Bank MySQL Database..."
echo

# Function to find MySQL executable
find_mysql() {
    # Check if MySQL is in PATH
    if command -v mysql &> /dev/null; then
        echo "MySQL found in PATH"
        echo "mysql"
        return 0
    fi
    
    # Check common locations
    local common_paths=(
        "/usr/bin/mysql"
        "/usr/local/bin/mysql"
        "/opt/mysql/bin/mysql"
        "/usr/local/mysql/bin/mysql"
    )
    
    for path in "${common_paths[@]}"; do
        if [ -f "$path" ]; then
            echo "MySQL found at: $path"
            echo "$path"
            return 0
        fi
    done
    
    echo "Error: MySQL not found" >&2
    echo "Please ensure MySQL is installed and in PATH" >&2
    return 1
}

# Find MySQL
MYSQL_CMD=$(find_mysql)
if [ $? -ne 0 ]; then
    exit 1
fi

echo "Proceeding with database setup..."
echo

# Execute SQL scripts
echo "Creating database..."
$MYSQL_CMD -u root -p < 01_create_database.sql

echo "Creating tables..."
$MYSQL_CMD -u root -p piggy_bank < 02_create_tables.sql

echo "Creating indexes..."
$MYSQL_CMD -u root -p piggy_bank < 03_create_indexes.sql

echo "Inserting sample data..."
$MYSQL_CMD -u root -p piggy_bank < 04_sample_data.sql

echo
echo "Database setup completed successfully!"
echo "Database: piggy_bank"
echo "Tables: users, kids, and audit tables"
echo