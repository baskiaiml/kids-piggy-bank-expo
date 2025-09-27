# GitLab CI/CD Integration

Automated deployments with GitLab CI/CD + AWS Free Tier.

## Cost: $0/month

## Quick Start

1. Deploy free tier infrastructure:
   ```bash
   ../ec2-free-tier/deploy-free-tier.bat
   ```

2. Configure GitLab variables:
   ```bash
   setup-gitlab-variables.bat
   ```

3. Copy `.gitlab-ci.yml` to your repository root

## Files

- `.gitlab-ci.yml` - GitLab CI/CD pipeline
- `setup-gitlab-variables.bat` - Helper for GitLab configuration

## Features

✅ Automated deployments
✅ GitLab CI/CD (FREE)
✅ AWS Free Tier infrastructure
✅ Dev/Prod branch separation
✅ Database migrations
✅ Health checks
