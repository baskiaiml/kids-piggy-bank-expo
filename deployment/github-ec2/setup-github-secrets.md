# GitHub Secrets Setup Guide

This guide helps you configure GitHub Secrets for automated EC2 deployment.

## Required Secrets

### AWS Credentials
```
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=your-secret-key
```

### EC2 Instance
```
EC2_INSTANCE_ID=i-1234567890abcdef0
```

### Database Configuration
```
DB_HOST=your-rds-endpoint.ap-south-1.rds.amazonaws.com
DB_PORT=3306
DB_NAME=kids_piggy_bank
DB_USERNAME=admin
DB_PASSWORD=your-secure-password
```

### Application Configuration
```
JWT_SECRET=your-jwt-secret-key-minimum-32-characters
```

## How to Set Up Secrets

### Step 1: Create AWS IAM User
1. Go to AWS IAM Console
2. Create new user: `github-actions-deploy`
3. Attach policies:
   - `AmazonEC2FullAccess`
   - `AmazonRDSFullAccess`
   - `AmazonSSMFullAccess`

### Step 2: Generate Access Keys
1. Go to IAM → Users → github-actions-deploy
2. Security credentials → Create access key
3. Copy Access Key ID and Secret Access Key

### Step 3: Set Up SSH Key for EC2
```bash
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github-actions

# Copy public key to EC2
ssh-copy-id -i ~/.ssh/github-actions.pub ubuntu@your-ec2-ip

# Add private key to GitHub Secrets
cat ~/.ssh/github-actions
```

### Step 4: Configure GitHub Secrets
1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add each secret:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `AWS_ACCESS_KEY_ID` | `AKIA...` | AWS Access Key |
| `AWS_SECRET_ACCESS_KEY` | `your-secret` | AWS Secret Key |
| `EC2_INSTANCE_ID` | `i-1234...` | EC2 Instance ID |
| `DB_HOST` | `your-rds-endpoint` | RDS Endpoint |
| `DB_PORT` | `3306` | Database Port |
| `DB_NAME` | `kids_piggy_bank` | Database Name |
| `DB_USERNAME` | `admin` | Database Username |
| `DB_PASSWORD` | `your-password` | Database Password |
| `JWT_SECRET` | `your-jwt-secret` | JWT Secret Key |
| `EC2_SSH_KEY` | `-----BEGIN OPENSSH PRIVATE KEY-----...` | SSH Private Key |

## Security Best Practices

### 1. Use IAM Roles (Recommended)
Instead of access keys, use IAM roles with EC2:
```yaml
# In GitHub Actions workflow
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::123456789012:role/GitHubActionsRole
    aws-region: ap-south-1
```

### 2. Rotate Secrets Regularly
- Change database passwords monthly
- Rotate AWS access keys quarterly
- Update JWT secrets when compromised

### 3. Use Environment-Specific Secrets
- `DEV_DB_HOST` for development
- `PROD_DB_HOST` for production
- `STAGING_JWT_SECRET` for staging

### 4. Limit Secret Access
- Use least privilege principle
- Create separate IAM users for different environments
- Use AWS Secrets Manager for sensitive data

## Troubleshooting

### Common Issues

#### 1. SSH Connection Failed
```bash
# Test SSH connection
ssh -i ~/.ssh/github-actions ubuntu@your-ec2-ip

# Check EC2 security group
# Ensure port 22 is open for your IP
```

#### 2. AWS Credentials Error
```bash
# Test AWS credentials
aws sts get-caller-identity

# Check IAM permissions
aws ec2 describe-instances --instance-ids i-1234567890abcdef0
```

#### 3. Database Connection Failed
```bash
# Test database connection from EC2
mysql -h your-rds-endpoint -u admin -p

# Check RDS security group
# Ensure port 3306 is open for EC2 security group
```

#### 4. Docker Build Failed
```bash
# Check Docker installation on EC2
docker --version
docker-compose --version

# Test Docker build locally
cd server
docker build -t kids-piggy-bank .
```

## Monitoring and Alerts

### 1. Set Up CloudWatch Alarms
- CPU utilization > 80%
- Memory utilization > 85%
- Disk space > 90%

### 2. GitHub Actions Notifications
```yaml
- name: Notify on failure
  if: failure()
  uses: actions/github-script@v6
  with:
    script: |
      github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: '🚨 Deployment failed! Check the logs.'
      })
```

### 3. Health Check Monitoring
```bash
# Set up cron job for health checks
*/5 * * * * curl -f http://localhost:8080/api/health || echo "Health check failed" | mail -s "App Down" admin@example.com
```

## Cost Optimization

### 1. Use Spot Instances
- Save up to 90% on EC2 costs
- Suitable for development environments

### 2. Schedule Instances
```bash
# Start instance at 9 AM, stop at 6 PM (weekdays only)
0 9 * * 1-5 aws ec2 start-instances --instance-ids i-1234567890abcdef0
0 18 * * 1-5 aws ec2 stop-instances --instance-ids i-1234567890abcdef0
```

### 3. Monitor Costs
- Set up AWS Budgets
- Use AWS Cost Explorer
- Enable detailed billing

## Next Steps

1. ✅ Set up all GitHub Secrets
2. ✅ Test deployment with a small change
3. ✅ Configure monitoring and alerts
4. ✅ Set up backup procedures
5. ✅ Document deployment process
6. ✅ Train team on deployment workflow
