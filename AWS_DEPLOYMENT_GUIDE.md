# 🚀 Complete AWS ECS Fargate + Google Play Store Deployment Guide

## Overview

This guide will help you deploy your Kids Piggy Bank application to AWS ECS Fargate with automated CI/CD and publish to Google Play Store.

## Architecture

- **Backend**: Spring Boot on ECS Fargate (Free Tier)
- **Database**: RDS MySQL (Free Tier)
- **CI/CD**: AWS CodePipeline with GitHub integration
- **Mobile App**: React Native with Expo, published to Google Play Store

## Prerequisites

- AWS Account with CLI configured
- GitHub repository with your code
- Google Play Console account
- Expo account
- Node.js and npm installed

---

## Part 1: AWS Infrastructure Setup

### Step 1.1: Deploy Infrastructure

```bash
# Make scripts executable
chmod +x deployment/deploy-infrastructure.sh
chmod +x deployment/deploy-pipeline.sh

# Deploy infrastructure (replace with your GitHub details)
./deployment/deploy-infrastructure.sh yourusername kids-piggy-bank-expo ghp_your_github_token
```

### Step 1.2: Deploy CodePipeline

```bash
# Get the outputs from previous step and deploy pipeline
./deployment/deploy-pipeline.sh \
  yourusername \
  kids-piggy-bank-expo \
  ghp_your_github_token \
  123456789.dkr.ecr.us-east-1.amazonaws.com/kids-piggy-bank \
  piggy-bank-cluster \
  piggy-bank-dev-service \
  piggy-bank-prod-service
```

### Step 1.3: Update Mobile App Configuration

After infrastructure deployment, update your mobile app:

```javascript
// In mobile-ui/src/config/environment.js
const PROD_SERVER_URL = "http://YOUR_ALB_DNS_NAME.elb.amazonaws.com:8080/api";
```

---

## Part 2: Mobile App Configuration

### Step 2.1: Environment Configuration

Your mobile app now has simple environment switching:

```javascript
// mobile-ui/src/config/environment.js

// 🚀 QUICK URL SWITCHING - CHANGE HERE
const USE_DEV_SERVER = false; // Set to true for emulator testing

// Dev server URL (for emulator testing)
const DEV_SERVER_URL = "http://10.0.2.2:8085/api"; // Android emulator

// Production server URL (for Play Store)
const PROD_SERVER_URL = "http://your-alb-dns-name.elb.amazonaws.com:8080/api";
```

### Step 2.2: Testing in Emulator

1. Set `USE_DEV_SERVER = true` in `environment.js`
2. Run your local Spring Boot server
3. Test in Android emulator

### Step 2.3: Production Build

1. Set `USE_DEV_SERVER = false` in `environment.js`
2. Update `PROD_SERVER_URL` with your actual ALB DNS name
3. Build for production

---

## Part 3: Google Play Store Deployment

### Step 3.1: Prepare for Play Store

```bash
cd mobile-ui

# Install EAS CLI if not already installed
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure
```

### Step 3.2: Update EAS Configuration

Update `mobile-ui/eas.json`:

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
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

### Step 3.3: Build Production APK

```bash
# Build production APK
eas build --platform android --profile production
```

### Step 3.4: Google Play Console Setup

#### 3.4.1: Create App in Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Click "Create app"
3. Fill in app details:
   - App name: "Kids Piggy Bank"
   - Default language: English
   - App or game: App
   - Free or paid: Free

#### 3.4.2: Upload APK

1. Go to "Release" → "Production"
2. Click "Create new release"
3. Upload your APK from EAS build
4. Add release notes
5. Review and publish

---

## Part 4: CI/CD Pipeline Usage

### Step 4.1: Automatic Deployment Flow

1. **Push to GitHub** → Triggers pipeline
2. **Build Stage** → Builds Docker image and pushes to ECR
3. **Dev Deployment** → Automatically deploys to dev environment
4. **Manual Approval** → You approve for production
5. **Prod Deployment** → Deploys to production environment

### Step 4.2: Monitoring Pipeline

- View pipeline status: AWS CodePipeline console
- Monitor ECS services: AWS ECS console
- Check logs: CloudWatch Logs

---

## Part 5: Environment Management

### Development Workflow

1. **Local Development**: Use `USE_DEV_SERVER = true`
2. **Emulator Testing**: Test with local Spring Boot server
3. **Dev Environment**: Push to GitHub → Auto-deploy to dev
4. **Production**: Approve in pipeline → Deploy to prod

### URL Management

- **Emulator**: `http://10.0.2.2:8085/api`
- **Dev Environment**: `http://your-alb-dns.elb.amazonaws.com/api`
- **Production**: `http://your-alb-dns.elb.amazonaws.com:8080/api`

---

## Part 6: Troubleshooting

### Common Issues

#### 6.1: Pipeline Build Fails

- Check GitHub token permissions
- Verify repository access
- Check AWS permissions

#### 6.2: ECS Service Won't Start

- Check CloudWatch logs
- Verify environment variables
- Check security group rules

#### 6.3: Mobile App Can't Connect

- Verify ALB DNS name
- Check CORS configuration
- Test API endpoints directly

### Debugging Commands

```bash
# Check ECS service status
aws ecs describe-services --cluster piggy-bank-cluster --services piggy-bank-dev-service

# Check CloudWatch logs
aws logs describe-log-groups --log-group-name-prefix /ecs/piggy-bank

# Test API endpoint
curl http://your-alb-dns.elb.amazonaws.com:8080/actuator/health
```

---

## Part 7: Cost Optimization (Free Tier)

### AWS Free Tier Limits

- **EC2**: 750 hours/month (t3.micro)
- **RDS**: 750 hours/month (db.t3.micro)
- **ECS Fargate**: 20,000 GB-seconds/month
- **ALB**: 750 hours/month
- **CodePipeline**: 1 active pipeline

### Monitoring Costs

- Use AWS Cost Explorer
- Set up billing alerts
- Monitor Free Tier usage

---

## Part 8: Security Best Practices

### 8.1: Database Security

- Use private subnets for RDS
- Enable encryption at rest
- Regular security updates

### 8.2: Application Security

- Use HTTPS in production
- Implement proper CORS
- Regular dependency updates

### 8.3: Mobile App Security

- Use secure storage for tokens
- Implement proper authentication
- Regular security audits

---

## Part 9: Maintenance

### Regular Tasks

- Monitor application logs
- Update dependencies
- Review security patches
- Monitor costs

### Backup Strategy

- RDS automated backups (7 days)
- ECR image versioning
- GitHub repository as code backup

---

## Quick Reference

### Key URLs

- **AWS Console**: https://console.aws.amazon.com
- **Google Play Console**: https://play.google.com/console
- **Expo Dashboard**: https://expo.dev

### Important Files

- `deployment/ecs-fargate-infrastructure.yml` - Infrastructure template
- `deployment/codepipeline.yml` - Pipeline template
- `mobile-ui/src/config/environment.js` - App configuration
- `server/Dockerfile` - Container configuration

### Commands

```bash
# Deploy infrastructure
./deployment/deploy-infrastructure.sh owner repo token

# Deploy pipeline
./deployment/deploy-pipeline.sh owner repo token ecr-uri cluster dev-service prod-service

# Build mobile app
cd mobile-ui && eas build --platform android --profile production
```

---

## Support

If you encounter issues:

1. Check AWS CloudFormation console for stack events
2. Review CloudWatch logs for application errors
3. Verify GitHub repository permissions
4. Check ECS service health status

---

**🎉 Congratulations!** You now have a complete CI/CD pipeline with AWS ECS Fargate and Google Play Store deployment!
