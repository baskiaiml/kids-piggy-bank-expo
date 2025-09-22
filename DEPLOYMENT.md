# 🚀 Kids Piggy Bank - Deployment Guide

This guide covers deploying the Kids Piggy Bank application to AWS and publishing to Google Play Store.

## 📋 Prerequisites

### AWS Requirements

- AWS Account with appropriate permissions
- AWS CLI configured (`aws configure`)
- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt or AWS Certificate Manager)

### Google Play Store Requirements

- Google Play Developer Account ($25 one-time fee)
- Google Play Console access
- Service account for automated uploads

---

## 🌐 Part 1: AWS Server Deployment

### Step 1: Set Up AWS Infrastructure

1. **Deploy CloudFormation Stack:**

```bash
# Set your parameters
export KEY_PAIR_NAME="your-key-pair"
export DOMAIN_NAME="yourdomain.com"  # Optional
export DB_PASSWORD="your-secure-password"
export JWT_SECRET="your-super-secret-jwt-key-min-32-chars"

# Deploy infrastructure
aws cloudformation create-stack \
  --stack-name kids-piggy-bank \
  --template-body file://deployment/aws-infrastructure.yml \
  --parameters \
    ParameterKey=KeyPairName,ParameterValue=$KEY_PAIR_NAME \
    ParameterKey=DomainName,ParameterValue=$DOMAIN_NAME \
    ParameterKey=DBPassword,ParameterValue=$DB_PASSWORD \
    ParameterKey=JWTSecret,ParameterValue=$JWT_SECRET \
  --capabilities CAPABILITY_IAM
```

2. **Wait for Stack Creation:**

```bash
aws cloudformation wait stack-create-complete --stack-name kids-piggy-bank
```

3. **Get Stack Outputs:**

```bash
aws cloudformation describe-stacks --stack-name kids-piggy-bank --query 'Stacks[0].Outputs'
```

### Step 2: Set Up Database

1. **Connect to RDS Instance:**

```bash
# Get database endpoint from CloudFormation outputs
DB_ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name kids-piggy-bank \
  --query 'Stacks[0].Outputs[?OutputKey==`DatabaseEndpoint`].OutputValue' \
  --output text)

# Connect to database
mysql -h $DB_ENDPOINT -u admin -p
```

2. **Run Database Scripts:**

```sql
-- Run the database creation scripts
source server/src/main/resources/sql/01_create_database.sql;
source server/src/main/resources/sql/02_create_tables.sql;
source server/src/main/resources/sql/03_create_indexes.sql;
source server/src/main/resources/sql/04_sample_data.sql;
```

### Step 3: Deploy Application

1. **Set Environment Variables:**

```bash
export AWS_REGION="us-east-1"
export EC2_INSTANCE_ID=$(aws cloudformation describe-stacks \
  --stack-name kids-piggy-bank \
  --query 'Stacks[0].Outputs[?OutputKey==`WebServerPublicIP`].OutputValue' \
  --output text)
export S3_BUCKET_NAME="kids-piggy-bank-deployments"
export DB_HOST=$DB_ENDPOINT
export DB_USERNAME="admin"
export DB_PASSWORD="your-secure-password"
export JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
export CORS_ALLOWED_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"
```

2. **Create S3 Bucket:**

```bash
aws s3 mb s3://$S3_BUCKET_NAME --region $AWS_REGION
```

3. **Deploy Application:**

```bash
chmod +x deployment/aws-deploy.sh
./deployment/aws-deploy.sh
```

### Step 4: Configure SSL (Optional)

1. **Request SSL Certificate:**

```bash
# Using AWS Certificate Manager
aws acm request-certificate \
  --domain-name yourdomain.com \
  --subject-alternative-names www.yourdomain.com \
  --validation-method DNS
```

2. **Update Load Balancer for HTTPS:**

- Add HTTPS listener on port 443
- Attach SSL certificate
- Redirect HTTP to HTTPS

---

## 📱 Part 2: Google Play Store Deployment

### Step 1: Prepare Google Play Console

1. **Create New App:**

   - Go to Google Play Console
   - Click "Create app"
   - Fill in app details:
     - App name: "Kids Piggy Bank"
     - Default language: English
     - App or game: App
     - Free or paid: Free

2. **Set Up App Content:**
   - Privacy Policy (required)
   - App category: Finance
   - Content rating questionnaire
   - Target audience: Children

### Step 2: Configure EAS Build

1. **Install EAS CLI:**

```bash
npm install -g @expo/eas-cli
```

2. **Login to Expo:**

```bash
eas login
```

3. **Configure Project:**

```bash
cd mobile-ui
eas build:configure
```

4. **Update eas.json:**
   - Set your production API URL
   - Configure Android build settings
   - Set up service account for automated uploads

### Step 3: Build Production APK

1. **Set Production Environment:**

```bash
export PRODUCTION_API_URL="https://api.yourdomain.com/api"
```

2. **Build APK:**

```bash
chmod +x scripts/build-production.js
node scripts/build-production.js
```

3. **Download APK:**
   - Go to EAS dashboard
   - Download the production APK
   - Test on physical device

### Step 4: Upload to Google Play Store

1. **Create Release:**

   - Go to Google Play Console
   - Navigate to "Release" → "Production"
   - Click "Create new release"

2. **Upload APK:**

   - Upload the production APK
   - Add release notes
   - Review release details

3. **Submit for Review:**
   - Complete all required sections
   - Submit for Google review
   - Wait for approval (1-3 days)

---

## 🔧 Configuration Management

### Environment Variables

**Server Environment Variables:**

```bash
# Database
DB_HOST=your-rds-endpoint.amazonaws.com
DB_USERNAME=admin
DB_PASSWORD=your-secure-password

# Security
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**Mobile App Environment Variables:**

```bash
# Production API URL
PRODUCTION_API_URL=https://api.yourdomain.com/api

# Build environment
REACT_NATIVE_ENV=production
```

### SSL Certificate Setup

1. **Using Let's Encrypt (Free):**

```bash
# Install Certbot
sudo apt install certbot

# Request certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

2. **Using AWS Certificate Manager:**

- Request certificate in AWS Console
- Validate domain ownership
- Attach to Load Balancer

---

## 📊 Monitoring and Maintenance

### Health Checks

1. **Application Health:**

   - Endpoint: `https://api.yourdomain.com/actuator/health`
   - Monitor response times and status

2. **Database Health:**

   - Monitor RDS metrics in CloudWatch
   - Set up alerts for high CPU/memory usage

3. **Server Health:**
   - Monitor EC2 instance metrics
   - Set up CloudWatch alarms

### Backup Strategy

1. **Database Backups:**

   - RDS automated backups (7 days retention)
   - Manual snapshots before major updates

2. **Application Backups:**
   - S3 versioning enabled
   - Cross-region replication for critical data

### Security Considerations

1. **Network Security:**

   - VPC with private subnets for database
   - Security groups with minimal access
   - WAF for additional protection

2. **Application Security:**

   - HTTPS everywhere
   - JWT token validation
   - Input validation and sanitization

3. **Data Security:**
   - Database encryption at rest
   - Secure password hashing (BCrypt)
   - Regular security updates

---

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Issues:**

   - Check security group rules
   - Verify RDS endpoint
   - Test connectivity from EC2

2. **SSL Certificate Issues:**

   - Verify domain validation
   - Check certificate expiration
   - Test HTTPS endpoints

3. **Build Issues:**
   - Check environment variables
   - Verify API URLs
   - Test on physical device

### Support Resources

- AWS Documentation: https://docs.aws.amazon.com/
- Expo Documentation: https://docs.expo.dev/
- Google Play Console Help: https://support.google.com/googleplay/android-developer/

---

## 📈 Scaling Considerations

### Horizontal Scaling

- Use Application Load Balancer
- Deploy multiple EC2 instances
- Use RDS Read Replicas

### Vertical Scaling

- Upgrade EC2 instance types
- Increase RDS instance size
- Optimize database queries

### Cost Optimization

- Use Reserved Instances for predictable workloads
- Implement auto-scaling
- Monitor and optimize resource usage

---

## ✅ Deployment Checklist

### Pre-Deployment

- [ ] AWS account configured
- [ ] Domain name registered
- [ ] SSL certificate obtained
- [ ] Google Play Developer account created
- [ ] Environment variables set

### Server Deployment

- [ ] CloudFormation stack deployed
- [ ] Database created and populated
- [ ] Application deployed to EC2
- [ ] SSL certificate configured
- [ ] Health checks passing

### Mobile App Deployment

- [ ] Production build created
- [ ] APK tested on device
- [ ] Google Play Console configured
- [ ] App uploaded to Play Store
- [ ] Release submitted for review

### Post-Deployment

- [ ] Monitoring configured
- [ ] Alerts set up
- [ ] Backup strategy implemented
- [ ] Documentation updated
- [ ] Team trained on deployment process

---

**🎉 Congratulations! Your Kids Piggy Bank app is now live on AWS and Google Play Store!**
