# 🚀 Complete Deployment Guide: Server + Mobile App

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Server Deployment (AWS ECS Fargate)](#server-deployment)
3. [Mobile App Deployment (Google Play Store)](#mobile-app-deployment)
4. [Testing & Verification](#testing--verification)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts & Tools

- ✅ AWS Account (Free Tier eligible)
- ✅ GitHub Account with repository
- ✅ Google Play Console Account
- ✅ Expo Account
- ✅ Node.js (v16+) and npm
- ✅ AWS CLI installed and configured
- ✅ Git installed

### AWS CLI Setup

```bash
# Install AWS CLI (if not installed)
# Windows: Download from https://aws.amazon.com/cli/
# Mac: brew install awscli
# Linux: sudo apt-get install awscli

# Configure AWS CLI
aws configure
# Enter your Access Key ID, Secret Access Key, Region (us-east-1), Output format (json)
```

### GitHub Token Setup

1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo`, `admin:repo_hook`
4. Copy the token (you'll need it for deployment)

---

## Server Deployment (AWS ECS Fargate)

### Step 1: Prepare Your Code

#### 1.1: Ensure Your Repository Structure

```
kids-piggy-bank-expo/
├── server/
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
├── mobile-ui/
├── deployment/
│   ├── ecs-fargate-infrastructure.yml
│   ├── codepipeline.yml
│   ├── deploy-infrastructure.sh
│   └── deploy-pipeline.sh
└── quick-setup.sh
```

#### 1.2: Verify Dockerfile

Ensure your `server/Dockerfile` exists and is correct:

```dockerfile
# Multi-stage Dockerfile for Spring Boot Application
FROM maven:3.8.6-openjdk-11-slim AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:11-jre-slim
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
RUN groupadd -r appuser && useradd -r -g appuser appuser
WORKDIR /app
COPY --from=build /app/target/piggy-bank-*.jar app.jar
COPY --from=build /app/src/main/resources/sql ./sql
RUN chown -R appuser:appuser /app
USER appuser
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1
ENV JAVA_OPTS="-Xmx512m -Xms256m -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
```

### Step 2: Deploy AWS Infrastructure

#### 2.1: Quick Setup (Recommended)

```bash
# Make script executable (Linux/Mac)
chmod +x quick-setup.sh

# Run quick setup
./quick-setup.sh
# Enter: GitHub username, repository name, GitHub token
```

#### 2.2: Manual Setup (Alternative)

```bash
# Step 1: Deploy Infrastructure
chmod +x deployment/deploy-infrastructure.sh
./deployment/deploy-infrastructure.sh yourusername kids-piggy-bank-expo ghp_your_github_token

# Step 2: Deploy Pipeline (after infrastructure is ready)
chmod +x deployment/deploy-pipeline.sh
./deployment/deploy-pipeline.sh \
  yourusername \
  kids-piggy-bank-expo \
  ghp_your_github_token \
  123456789.dkr.ecr.us-east-1.amazonaws.com/kids-piggy-bank \
  piggy-bank-cluster \
  piggy-bank-dev-service \
  piggy-bank-prod-service
```

#### 2.3: Save Important Outputs

After deployment, save these values:

- **Load Balancer DNS**: `your-alb-name.elb.amazonaws.com`
- **Database Endpoint**: `your-db-endpoint.rds.amazonaws.com`
- **ECR Repository URI**: `123456789.dkr.ecr.us-east-1.amazonaws.com/kids-piggy-bank`
- **Database Password**: Generated secure password
- **JWT Secret**: Generated secure secret

### Step 3: Trigger First Deployment

#### 3.1: Push Code to GitHub

```bash
# Add all files
git add .

# Commit changes
git commit -m "Initial deployment setup"

# Push to trigger pipeline
git push origin main
```

#### 3.2: Monitor Pipeline

1. Go to [AWS CodePipeline Console](https://console.aws.amazon.com/codesuite/codepipeline)
2. Find your pipeline: `piggy-bank-pipeline`
3. Watch the build progress:
   - **Source**: Downloads code from GitHub
   - **Build**: Builds Docker image, pushes to ECR
   - **DeployDev**: Deploys to dev environment
   - **Approval**: Waits for your approval
   - **DeployProd**: Deploys to production (after approval)

#### 3.3: Approve Production Deployment

1. In CodePipeline console, click on the pipeline
2. When it reaches "Approval" stage, click "Review"
3. Click "Approve" to deploy to production

### Step 4: Verify Server Deployment

#### 4.1: Check ECS Services

```bash
# Check dev service
aws ecs describe-services --cluster piggy-bank-cluster --services piggy-bank-dev-service

# Check prod service
aws ecs describe-services --cluster piggy-bank-cluster --services piggy-bank-prod-service
```

#### 4.2: Test API Endpoints

```bash
# Test dev environment
curl http://your-alb-dns.elb.amazonaws.com/actuator/health

# Test production environment
curl http://your-alb-dns.elb.amazonaws.com:8080/actuator/health

# Test API endpoint
curl http://your-alb-dns.elb.amazonaws.com:8080/api/auth/validate
```

#### 4.3: Check Logs

```bash
# View application logs
aws logs describe-log-groups --log-group-name-prefix /ecs/piggy-bank
aws logs get-log-events --log-group-name /ecs/piggy-bank --log-stream-name dev/piggy-bank-dev/container-id
```

---

## Mobile App Deployment (Google Play Store)

### Step 1: Prepare Mobile App

#### 1.1: Update Environment Configuration

```bash
# Navigate to mobile app directory
cd mobile-ui

# Update environment.js with your production URL
# Edit mobile-ui/src/config/environment.js
```

Update the file:

```javascript
// mobile-ui/src/config/environment.js

// 🚀 QUICK URL SWITCHING - CHANGE HERE
const USE_DEV_SERVER = false; // Set to false for Play Store

// Dev server URL (for emulator testing)
const DEV_SERVER_URL = "http://10.0.2.2:8085/api";

// Production server URL (for Play Store) - UPDATE THIS
const PROD_SERVER_URL = "http://YOUR_ALB_DNS_NAME.elb.amazonaws.com:8080/api";
```

#### 1.2: Install EAS CLI

```bash
# Install EAS CLI globally
npm install -g @expo/eas-cli

# Login to Expo
eas login
# Enter your Expo username and password
```

#### 1.3: Configure EAS Build

```bash
# Initialize EAS configuration
eas build:configure

# This creates eas.json file
```

Update `eas.json`:

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "env": {
        "REACT_NATIVE_ENV": "production"
      },
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

### Step 2: Build Production APK

#### 2.1: Build for Android

```bash
# Build production APK
eas build --platform android --profile production

# This will:
# 1. Upload your code to Expo's build servers
# 2. Build the APK
# 3. Provide download link when complete
```

#### 2.2: Download APK

1. Wait for build to complete (5-10 minutes)
2. Copy the download URL from the terminal
3. Download the APK file

### Step 3: Google Play Console Setup

#### 3.1: Create App in Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Click "Create app"
3. Fill in app details:
   - **App name**: "Kids Piggy Bank"
   - **Default language**: English
   - **App or game**: App
   - **Free or paid**: Free
   - **Declarations**: Check all required boxes

#### 3.2: Complete App Information

1. **App details**:

   - Short description: "Financial management app for kids"
   - Full description: "Help your kids learn money management with this interactive piggy bank app"
   - App icon: Upload 512x512 PNG icon
   - Feature graphic: Upload 1024x500 PNG graphic

2. **Content rating**: Complete questionnaire
3. **Target audience**: Select appropriate age ranges
4. **Ads**: Choose whether to show ads
5. **Data safety**: Complete data safety form

#### 3.3: Upload APK

1. Go to "Release" → "Production"
2. Click "Create new release"
3. Upload your APK file
4. Add release notes:

   ```
   Initial release of Kids Piggy Bank app

   Features:
   - Secure user registration and login
   - Kid profile management
   - Financial goal tracking
   - Transaction history
   - Settings configuration
   ```

5. Click "Review release"

#### 3.4: Review and Publish

1. Review all information
2. Click "Start rollout to production"
3. Your app will be published (may take a few hours)

### Step 4: Test Mobile App

#### 4.1: Test in Emulator (Development)

```bash
# Set development mode
# Edit mobile-ui/src/config/environment.js
const USE_DEV_SERVER = true;

# Start your local server
cd ../server
mvn spring-boot:run

# Start mobile app
cd ../mobile-ui
npm start
# Choose Android emulator
```

#### 4.2: Test Production Build

```bash
# Set production mode
# Edit mobile-ui/src/config/environment.js
const USE_DEV_SERVER = false;

# Build and test
eas build --platform android --profile production
# Install APK on device and test
```

---

## Testing & Verification

### Server Testing Checklist

#### ✅ API Endpoints

```bash
# Health check
curl http://your-alb-dns.elb.amazonaws.com:8080/actuator/health

# User registration
curl -X POST http://your-alb-dns.elb.amazonaws.com:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+1234567890","name":"TestUser","pin":"1234","confirmPin":"1234"}'

# User login
curl -X POST http://your-alb-dns.elb.amazonaws.com:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+1234567890","pin":"1234"}'
```

#### ✅ Database Connection

1. Go to AWS RDS Console
2. Find your database instance
3. Check "Monitoring" tab for connection metrics
4. Verify database is accessible from ECS tasks

#### ✅ ECS Service Health

1. Go to AWS ECS Console
2. Check service status: "ACTIVE"
3. Check task status: "RUNNING"
4. Verify health checks are passing

### Mobile App Testing Checklist

#### ✅ App Functionality

- [ ] User registration works
- [ ] User login works
- [ ] Dashboard loads correctly
- [ ] Kid management works
- [ ] Settings can be updated
- [ ] Transactions can be created
- [ ] All screens navigate properly

#### ✅ Network Connectivity

- [ ] App connects to production server
- [ ] API calls return expected responses
- [ ] Error handling works for network issues
- [ ] Loading states display correctly

#### ✅ Performance

- [ ] App loads quickly
- [ ] Smooth navigation
- [ ] No memory leaks
- [ ] Battery usage is reasonable

---

## Troubleshooting

### Common Server Issues

#### Issue: Pipeline Build Fails

**Symptoms**: Build stage fails in CodePipeline
**Solutions**:

1. Check GitHub token permissions
2. Verify repository access
3. Check AWS permissions for CodeBuild
4. Review build logs in CodeBuild console

#### Issue: ECS Service Won't Start

**Symptoms**: Service shows "STOPPED" or tasks keep restarting
**Solutions**:

1. Check CloudWatch logs for errors
2. Verify environment variables are set correctly
3. Check security group rules
4. Ensure database is accessible

#### Issue: Database Connection Failed

**Symptoms**: App can't connect to database
**Solutions**:

1. Check RDS security group allows ECS security group
2. Verify database endpoint is correct
3. Check database credentials
4. Ensure database is in private subnet

### Common Mobile App Issues

#### Issue: App Can't Connect to Server

**Symptoms**: "Network error" messages
**Solutions**:

1. Verify ALB DNS name is correct
2. Check CORS configuration on server
3. Test API endpoints directly with curl
4. Check network connectivity

#### Issue: Build Fails

**Symptoms**: EAS build fails
**Solutions**:

1. Check eas.json configuration
2. Verify all dependencies are installed
3. Check for syntax errors in code
4. Review build logs in Expo dashboard

#### Issue: App Crashes on Startup

**Symptoms**: App crashes immediately
**Solutions**:

1. Check for JavaScript errors in logs
2. Verify all imports are correct
3. Check for missing dependencies
4. Test on different devices

### Debugging Commands

#### Server Debugging

```bash
# Check ECS service status
aws ecs describe-services --cluster piggy-bank-cluster --services piggy-bank-prod-service

# View application logs
aws logs get-log-events --log-group-name /ecs/piggy-bank --log-stream-name prod/piggy-bank-prod/container-id

# Test API endpoint
curl -v http://your-alb-dns.elb.amazonaws.com:8080/actuator/health

# Check ALB health
aws elbv2 describe-target-health --target-group-arn your-target-group-arn
```

#### Mobile App Debugging

```bash
# Check build status
eas build:list

# View build logs
eas build:view [build-id]

# Test locally
npm start
# Then scan QR code with Expo Go app
```

---

## Post-Deployment Checklist

### Server Maintenance

- [ ] Monitor CloudWatch logs regularly
- [ ] Set up billing alerts
- [ ] Update dependencies monthly
- [ ] Review security groups quarterly
- [ ] Backup database regularly

### Mobile App Maintenance

- [ ] Monitor crash reports in Play Console
- [ ] Update app regularly with new features
- [ ] Respond to user reviews
- [ ] Monitor app performance metrics
- [ ] Update dependencies regularly

### Security Best Practices

- [ ] Use HTTPS in production
- [ ] Regular security updates
- [ ] Monitor access logs
- [ ] Use strong passwords
- [ ] Enable MFA on all accounts

---

## Support Resources

### AWS Resources

- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [AWS CodePipeline Documentation](https://docs.aws.amazon.com/codepipeline/)
- [AWS RDS Documentation](https://docs.aws.amazon.com/rds/)

### Mobile App Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)

### General Support

- Check AWS CloudFormation console for stack events
- Review CloudWatch logs for application errors
- Monitor ECS service health status
- Check GitHub repository permissions

---

**🎉 Congratulations!** You now have a complete deployment guide for both server and mobile app. Follow these steps carefully, and you'll have your Kids Piggy Bank app running on AWS and published to Google Play Store!
