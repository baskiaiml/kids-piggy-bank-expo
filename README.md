# 🐷 Kids Piggy Bank - Full Stack Application

A comprehensive full-stack application that helps kids learn about saving money through an interactive piggy bank experience. The application consists of a React Native mobile app (with Expo) and a Spring Boot backend server with MySQL database.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
  - [Backend Server Setup](#backend-server-setup)
  - [Database Setup](#database-setup)
  - [Mobile App Setup](#mobile-app-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🎯 Overview

The Kids Piggy Bank application is designed to teach children about financial responsibility through an engaging, interactive experience. It features:

### Mobile App Features

- **🏠 Home Screen**: Interactive piggy bank with add/withdraw money functionality
- **💰 Savings Screen**: Track savings history and transactions
- **🎯 Goals Screen**: Set and manage savings goals
- **⚙️ Settings Screen**: Customize app preferences
- **📱 Cross-Platform**: Works on iOS, Android, and Web
- **🎨 Beautiful UI**: Kid-friendly design with colorful gradients and icons

### Backend Features

- **🔐 Authentication**: Phone number + PIN based authentication
- **👨‍👩‍👧‍👦 User Management**: Parent/guardian account management
- **👶 Kid Profiles**: Manage multiple children under one account
- **📊 Audit Logging**: Complete audit trail for all operations
- **🔒 Security**: JWT tokens, password hashing, CORS protection
- **📈 Monitoring**: Health checks, metrics, and structured logging

## 🏗️ Architecture

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│   Mobile App    │◄──────────────►│  Spring Boot    │
│  (React Native) │                 │     Server      │
│                 │                 │                 │
│ • Expo          │                 │ • Spring Boot   │
│ • React Native  │                 │ • Spring Security│
│ • React Nav     │                 │ • Spring Data JPA│
│ • Vector Icons  │                 │ • JWT Auth      │
└─────────────────┘                 └─────────────────┘
                                             │
                                             │ JDBC
                                             ▼
                                    ┌─────────────────┐
                                    │   MySQL DB      │
                                    │                 │
                                    │ • Users         │
                                    │ • Kids          │
                                    │ • Audit Tables  │
                                    └─────────────────┘
```

## 📋 Prerequisites

### Required Software

- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **Java 17** - [Download here](https://adoptium.net/)
- **MySQL 8.0+** - [Download here](https://dev.mysql.com/downloads/)
- **Git** - [Download here](https://git-scm.com/)

### Optional (for mobile development)

- **Expo CLI**: `npm install -g @expo/cli`
- **iOS**: Xcode (macOS only) - [Download from App Store](https://apps.apple.com/us/app/xcode/id497799835)
- **Android**: Android Studio - [Download here](https://developer.android.com/studio)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd kids-piggy-bank-expo
```

### 2. Setup Database

```bash
# Windows
cd server/src/main/resources/sql
setup_database.bat

# Linux/Mac
cd server/src/main/resources/sql
chmod +x setup_database.sh
./setup_database.sh
```

### 3. Start Backend Server

```bash
cd server
mvn spring-boot:run
```

### 4. Start Mobile App

```bash
cd mobile-ui
npm install
npm start
```

## 📖 Detailed Setup

### Backend Server Setup

#### 1. Install Java 17

- Download and install Java 17 from [Adoptium](https://adoptium.net/)
- Verify installation: `java -version`

#### 2. Install Maven (if not included with IDE)

- Download from [Apache Maven](https://maven.apache.org/download.cgi)
- Add to PATH environment variable

#### 3. Configure Database Connection

Edit `server/src/main/resources/application.properties`:

```properties
# Update these values according to your MySQL setup
spring.datasource.url=jdbc:mysql://localhost:3306/piggy_bank?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

#### 4. Build and Run

```bash
cd server
mvn clean install
mvn spring-boot:run
```

The server will start on `http://localhost:8085`

### Database Setup

#### Automatic Setup (Recommended)

```bash
# Windows
cd server/src/main/resources/sql
setup_database.bat

# Linux/Mac
cd server/src/main/resources/sql
chmod +x setup_database.sh
./setup_database.sh
```

#### Manual Setup

1. **Create Database**:

   ```sql
   CREATE DATABASE piggy_bank CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Run SQL Scripts** (in order):
   ```bash
   mysql -u root -p piggy_bank < 01_create_database.sql
   mysql -u root -p piggy_bank < 02_create_tables.sql
   mysql -u root -p piggy_bank < 03_create_indexes.sql
   mysql -u root -p piggy_bank < 04_sample_data.sql
   ```

#### Database Schema

- **users**: User accounts with phone number authentication
- **kids**: Child profiles linked to users
- **users_aud**: Audit trail for users table
- **kids_aud**: Audit trail for kids table
- **revinfo**: Revision information for audit trails

### Mobile App Setup

#### 1. Install Dependencies

```bash
cd mobile-ui
npm install
```

#### 2. Configure API Endpoint

Update the API base URL in your mobile app configuration:

```javascript
// In your API configuration
const API_BASE_URL = "http://localhost:8085/api";
```

#### 3. Start Development Server

```bash
npm start
```

## 🏃‍♂️ Running the Application

### Backend Server

```bash
cd server
mvn spring-boot:run
```

- Server runs on: `http://localhost:8085`
- API Documentation: `http://localhost:8085/swagger-ui.html`
- Health Check: `http://localhost:8085/actuator/health`

### Mobile App

#### Web Browser

```bash
cd mobile-ui
npm run web
```

- Opens at: `http://localhost:8081`

#### iOS Simulator (macOS only)

```bash
cd mobile-ui
npm run ios
```

#### Android Emulator

```bash
cd mobile-ui
npm run android
```

#### Physical Device (Expo Go)

1. Install [Expo Go](https://expo.dev/client) on your device
2. Run `npm start` in mobile-ui directory
3. Scan QR code with Expo Go app

## 📚 API Documentation

### Authentication Endpoints

#### Sign Up

```http
POST /api/auth/signup
Content-Type: application/json

{
  "phoneNumber": "+1234567890",
  "pin": "1234",
  "confirmPin": "1234"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "phoneNumber": "+1234567890",
  "pin": "1234"
}
```

#### Validate Token

```http
GET /api/auth/validate
Authorization: Bearer <jwt_token>
```

### Kids Management Endpoints

#### Get Kids

```http
GET /api/kids
Authorization: Bearer <jwt_token>
```

#### Add Kid

```http
POST /api/kids
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Emma",
  "age": 8
}
```

#### Update Kid

```http
PUT /api/kids/{kidId}
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Emma Updated",
  "age": 9
}
```

#### Delete Kid

```http
DELETE /api/kids/{kidId}
Authorization: Bearer <jwt_token>
```

## 📁 Project Structure

```
kids-piggy-bank-expo/
├── mobile-ui/                          # React Native Mobile App
│   ├── src/
│   │   ├── screens/                    # App screens
│   │   │   ├── HomeScreen.js
│   │   │   ├── SavingsScreen.js
│   │   │   ├── GoalsScreen.js
│   │   │   ├── SettingsScreen.js
│   │   │   ├── LoginScreen.js
│   │   │   └── SignupScreen.js
│   │   ├── contexts/                   # React contexts
│   │   │   ├── AuthContext.js
│   │   │   └── KidsContext.js
│   │   └── utils/                      # Utility functions
│   │       └── mockAuth.js
│   ├── assets/                         # Images and icons
│   ├── android/                        # Android-specific code
│   ├── App.js                          # Root app component
│   ├── app.json                        # Expo configuration
│   └── package.json                    # Dependencies
├── server/                             # Spring Boot Backend
│   ├── src/main/java/com/piggybank/
│   │   ├── config/                     # Configuration classes
│   │   ├── controller/                 # REST controllers
│   │   ├── entity/                    # JPA entities
│   │   ├── repository/                # Data repositories
│   │   ├── service/                   # Business logic
│   │   ├── security/                  # Security configuration
│   │   └── PiggyBankApplication.java  # Main application class
│   ├── src/main/resources/
│   │   ├── sql/                       # Database scripts
│   │   │   ├── 01_create_database.sql
│   │   │   ├── 02_create_tables.sql
│   │   │   ├── 03_create_indexes.sql
│   │   │   ├── 04_sample_data.sql
│   │   │   ├── setup_database.bat     # Windows setup script
│   │   │   └── setup_database.sh      # Linux/Mac setup script
│   │   ├── application.properties     # Main configuration
│   │   ├── application-dev.properties # Development config
│   │   ├── application-prod.properties# Production config
│   │   └── logback-spring.xml         # Logging configuration
│   └── pom.xml                        # Maven dependencies
└── README.md                          # This file
```

## ⚙️ Configuration

### Environment Variables (Production)

#### Backend Server

```bash
# Database Configuration
DB_HOST=your-mysql-host
DB_PORT=3306
DB_NAME=piggy_bank
DB_USERNAME=piggybank_user
DB_PASSWORD=your-secure-password

# JWT Configuration
JWT_SECRET=your-jwt-secret-key

# Connection Pool
DB_POOL_MAX=20
DB_POOL_MIN=5
```

#### Mobile App

```javascript
// API Configuration
const config = {
  API_BASE_URL: process.env.API_BASE_URL || "http://localhost:8085/api",
  TIMEOUT: 10000,
};
```

### Development vs Production

#### Development

- Uses H2 in-memory database (optional)
- Debug logging enabled
- CORS allows all origins
- Hot reloading enabled

#### Production

- Uses MySQL database
- Optimized logging
- Restricted CORS origins
- SSL/TLS enabled
- Environment variable configuration

## 🐛 Troubleshooting

### Common Issues

#### Backend Issues

**1. Database Connection Failed**

```bash
# Check MySQL service
# Windows
net start mysql80

# Linux/Mac
sudo systemctl start mysql
```

**2. Port Already in Use**

```bash
# Kill process on port 8085
# Windows
netstat -ano | findstr :8085
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8085 | xargs kill -9
```

**3. Maven Build Failed**

```bash
# Clean and rebuild
mvn clean install -DskipTests
```

#### Mobile App Issues

**1. Metro Bundler Issues**

```bash
npx expo start --clear
```

**2. Node Modules Issues**

```bash
rm -rf node_modules
npm install
```

**3. Android Build Issues**

- Ensure Android Studio is installed
- Set ANDROID_HOME environment variable
- Create Android Virtual Device (AVD)

**4. iOS Build Issues**

- Ensure Xcode is installed (macOS only)
- Check iOS Simulator availability

#### Database Issues

**1. MySQL Not Found**

- Add MySQL bin directory to PATH
- Use full path: `"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"`

**2. Access Denied**

- Verify MySQL root password
- Check user permissions
- Ensure MySQL service is running

**3. Database Already Exists**

- Drop database: `DROP DATABASE piggy_bank;`
- Re-run setup scripts

### Getting Help

- Check the [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- Visit the [Expo Documentation](https://docs.expo.dev/)
- Review the [React Native Documentation](https://reactnative.dev/docs/getting-started)
- Check application logs in `server/logs/` directory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow Java coding standards for backend
- Follow React Native/JavaScript best practices for mobile app
- Write unit tests for new features
- Update documentation for API changes
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the application logs
3. Open an issue on GitHub with:
   - Detailed error description
   - Steps to reproduce
   - Environment information (OS, Java version, Node version)
   - Relevant log files

---

**Happy Saving! 🐷💰**

_Built with ❤️ using Spring Boot, React Native, and MySQL_
