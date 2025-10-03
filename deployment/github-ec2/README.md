# GitHub Actions + EC2 Deployment

Automated CI/CD deployment to AWS EC2 using GitHub Actions.

## 🚀 Quick Start

### 1. Deploy EC2 Infrastructure
```bash
cd deployment/ec2-free-tier
./deploy-free-tier.sh
```

### 2. Set Up EC2 Instance
```bash
# SSH to your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Run setup script
wget https://raw.githubusercontent.com/your-repo/main/deployment/github-ec2/ec2-deploy.sh
chmod +x ec2-deploy.sh
./ec2-deploy.sh
```

### 3. Configure GitHub Secrets
Follow the [GitHub Secrets Setup Guide](setup-github-secrets.md)

### 4. Deploy Application
```bash
# Push to main branch to trigger deployment
git add .
git commit -m "Initial deployment"
git push origin main
```

## 📋 What's Included

- **GitHub Actions Workflow** (`.github/workflows/deploy.yml`)
- **EC2 Setup Script** (`ec2-deploy.sh`)
- **GitHub Secrets Guide** (`setup-github-secrets.md`)

## 🔧 Features

### Automated Deployment
- ✅ Build Spring Boot application with Maven
- ✅ Create Docker image
- ✅ Deploy to EC2 instance
- ✅ Health check validation
- ✅ Zero-downtime deployment

### Monitoring & Maintenance
- ✅ Health check monitoring
- ✅ Log rotation
- ✅ Automated backups
- ✅ System monitoring tools

### Security
- ✅ SSH key authentication
- ✅ Firewall configuration
- ✅ Environment variable management
- ✅ Secure secret handling

## 💰 Cost Breakdown

| Component | Cost/Month | Notes |
|-----------|------------|-------|
| EC2 t2.micro | $0 | Free tier (750 hours) |
| RDS t2.micro | $0 | Free tier (750 hours) |
| GitHub Actions | $0 | 2000 minutes free |
| **Total** | **$0** | **Free tier eligible** |

## 🛠️ Architecture

```
GitHub Repository
       ↓
GitHub Actions
       ↓
AWS EC2 Instance
       ↓
Docker Container
       ↓
Spring Boot App
       ↓
RDS MySQL
```

## 📁 File Structure

```
deployment/github-ec2/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── ec2-deploy.sh               # EC2 instance setup script
├── setup-github-secrets.md     # GitHub secrets configuration
└── README.md                   # This file
```

## 🔄 Deployment Process

### 1. Code Push
```bash
git push origin main
```

### 2. GitHub Actions Trigger
- Checkout code
- Build with Maven
- Create deployment package
- Deploy to EC2

### 3. EC2 Deployment
- Stop existing container
- Build new Docker image
- Start new container
- Health check validation

### 4. Success Notification
- Deployment status
- Health check results
- Log access information

## 🚨 Troubleshooting

### Common Issues

#### 1. SSH Connection Failed
```bash
# Check EC2 security group
# Ensure port 22 is open
# Verify SSH key permissions
chmod 600 your-key.pem
```

#### 2. Docker Build Failed
```bash
# Check Docker installation
docker --version

# Test build locally
cd server
docker build -t kids-piggy-bank .
```

#### 3. Database Connection Failed
```bash
# Check RDS security group
# Ensure port 3306 is open
# Verify database credentials
```

#### 4. Health Check Failed
```bash
# Check application logs
docker logs kids-piggy-bank

# Test health endpoint
curl http://localhost:8080/api/health
```

### Debug Commands

```bash
# Check GitHub Actions logs
# Go to Actions tab in GitHub repository

# Check EC2 instance status
aws ec2 describe-instances --instance-ids i-1234567890abcdef0

# Check application status on EC2
ssh ubuntu@your-ec2-ip "docker ps"
ssh ubuntu@your-ec2-ip "docker logs kids-piggy-bank"

# Check system resources
ssh ubuntu@your-ec2-ip "htop"
ssh ubuntu@your-ec2-ip "df -h"
```

## 📊 Monitoring

### Health Checks
- Application health endpoint
- Database connectivity
- System resource usage
- Log file monitoring

### Alerts
- Deployment failures
- Health check failures
- High resource usage
- Security incidents

### Logs
- Application logs: `/var/log/kids-piggy-bank/`
- System logs: `/var/log/syslog`
- Docker logs: `docker logs kids-piggy-bank`

## 🔒 Security

### Access Control
- SSH key authentication
- IAM role-based access
- Environment variable encryption
- Secret management

### Network Security
- Security group configuration
- Firewall rules
- VPC isolation
- SSL/TLS encryption

### Data Protection
- Database encryption
- Backup encryption
- Log sanitization
- Secret rotation

## 📈 Scaling

### Horizontal Scaling
- Multiple EC2 instances
- Load balancer configuration
- Auto-scaling groups
- Database read replicas

### Vertical Scaling
- Instance type upgrades
- Memory optimization
- CPU optimization
- Storage optimization

## 🔄 Backup & Recovery

### Automated Backups
- Daily application backups
- Weekly database backups
- Monthly system snapshots
- Configuration backups

### Recovery Procedures
- Application rollback
- Database restore
- System recovery
- Disaster recovery

## 📞 Support

### Documentation
- [GitHub Secrets Setup](setup-github-secrets.md)
- [EC2 Free Tier Guide](../ec2-free-tier/README.md)
- [Main Deployment Guide](../README.md)

### Resources
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Docker Documentation](https://docs.docker.com/)

### Community
- [GitHub Issues](https://github.com/your-repo/issues)
- [Discussions](https://github.com/your-repo/discussions)
- [Wiki](https://github.com/your-repo/wiki)

## 🎯 Next Steps

1. ✅ Set up GitHub repository
2. ✅ Deploy EC2 infrastructure
3. ✅ Configure GitHub Actions
4. ✅ Test deployment pipeline
5. ✅ Set up monitoring
6. ✅ Configure backups
7. ✅ Document procedures
8. ✅ Train team members

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the deployment
5. Submit a pull request

## 📧 Contact

For questions or support, please open an issue in the GitHub repository.
