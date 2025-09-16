# Database Setup Scripts

This folder contains SQL scripts and setup tools for the Kids Piggy Bank database.

## Quick Setup

### Windows

```cmd
setup_database.bat
```

### Linux/Mac

```bash
./setup_database.sh
```

## Manual Setup

Execute the SQL scripts in the following order:

1. **01_create_database.sql** - Creates the database and sets up basic configuration
2. **02_create_tables.sql** - Creates all required tables including audit tables
3. **03_create_indexes.sql** - Creates additional indexes for performance optimization
4. **04_sample_data.sql** - (Optional) Inserts sample data for testing

## Database Configuration

- **Database Name**: `piggy_bank`
- **Character Set**: `utf8mb4`
- **Collation**: `utf8mb4_unicode_ci`
- **Engine**: `InnoDB`

## Tables Created

### Main Tables

- **users** - User accounts with phone number authentication
- **kids** - Child profiles linked to users

### Audit Tables (Hibernate Envers)

- **users_aud** - Audit trail for users table
- **kids_aud** - Audit trail for kids table
- **revinfo** - Revision information for audit trails

## Connection Details

Default connection parameters:

- **Host**: localhost
- **Port**: 3306
- **Database**: piggy_bank
- **Username**: root
- **Password**: my$ql@r0ot (as configured in application.properties)

## Troubleshooting

### MySQL Not Found

- Ensure MySQL is installed and running
- Add MySQL bin directory to system PATH
- Or update the setup script with correct MySQL path

### Access Denied

- Verify MySQL root password
- Ensure MySQL service is running
- Check user permissions

### Performance

- Indexes are created for frequently queried columns
- Foreign key constraints ensure data integrity
- Connection pooling is configured in application.properties
