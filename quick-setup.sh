#!/bin/bash
# quick-setup.sh
# One-click setup for AWS ECS Fargate deployment

set -e

echo "🚀 Kids Piggy Bank - AWS ECS Fargate Quick Setup"
echo "================================================"

# Check prerequisites
echo "🔍 Checking prerequisites..."

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install it first:"
    echo "   https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Check if AWS is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

# Check GitHub CLI or curl
if ! command -v curl &> /dev/null; then
    echo "❌ curl not found. Please install curl."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Get user input
echo ""
echo "📝 Please provide the following information:"
echo ""

read -p "GitHub Username: " GITHUB_USERNAME
read -p "GitHub Repository Name: " GITHUB_REPO
read -s -p "GitHub Personal Access Token: " GITHUB_TOKEN
echo ""

# Validate inputs
if [ -z "$GITHUB_USERNAME" ] || [ -z "$GITHUB_REPO" ] || [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ All fields are required!"
    exit 1
fi

# Test GitHub token
echo "🔐 Testing GitHub token..."
if ! curl -s -H "Authorization: token $GITHUB_TOKEN" "https://api.github.com/user" | grep -q "login"; then
    echo "❌ Invalid GitHub token. Please check your token permissions."
    exit 1
fi
echo "✅ GitHub token is valid!"

# Generate secure passwords
echo "🔑 Generating secure credentials..."
DB_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 64)

echo "✅ Credentials generated!"

# Deploy infrastructure
echo ""
echo "🏗️  Deploying AWS infrastructure..."
echo "This may take 10-15 minutes..."

if ! ./deployment/deploy-infrastructure.sh "$GITHUB_USERNAME" "$GITHUB_REPO" "$GITHUB_TOKEN" "$DB_PASSWORD" "$JWT_SECRET"; then
    echo "❌ Infrastructure deployment failed!"
    exit 1
fi

# Get infrastructure outputs
echo "📊 Getting infrastructure outputs..."
STACK_NAME="KidsPiggyBankInfrastructure"
REGION="us-east-1"

LOAD_BALANCER_DNS=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query "Stacks[0].Outputs[?OutputKey=='LoadBalancerDNS'].OutputValue" \
    --output text)

ECR_URI=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query "Stacks[0].Outputs[?OutputKey=='ECRRepositoryURI'].OutputValue" \
    --output text)

ECS_CLUSTER=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query "Stacks[0].Outputs[?OutputKey=='ECSClusterName'].OutputValue" \
    --output text)

# Deploy pipeline
echo ""
echo "🔄 Deploying CI/CD pipeline..."

if ! ./deployment/deploy-pipeline.sh \
    "$GITHUB_USERNAME" \
    "$GITHUB_REPO" \
    "$GITHUB_TOKEN" \
    "$ECR_URI" \
    "$ECS_CLUSTER" \
    "piggy-bank-dev-service" \
    "piggy-bank-prod-service"; then
    echo "❌ Pipeline deployment failed!"
    exit 1
fi

# Update mobile app configuration
echo ""
echo "📱 Updating mobile app configuration..."

# Create backup of environment.js
cp mobile-ui/src/config/environment.js mobile-ui/src/config/environment.js.backup

# Update environment.js with production URL
sed -i.bak "s|http://your-alb-dns-name.elb.amazonaws.com:8080/api|http://$LOAD_BALANCER_DNS:8080/api|g" mobile-ui/src/config/environment.js

echo "✅ Mobile app configuration updated!"

# Create credentials file
echo ""
echo "💾 Saving credentials..."
cat > deployment/credentials.txt << EOF
# Kids Piggy Bank - AWS Deployment Credentials
# Generated on: $(date)

## Database Credentials
Database Password: $DB_PASSWORD

## JWT Secret
JWT Secret: $JWT_SECRET

## AWS Resources
Load Balancer DNS: $LOAD_BALANCER_DNS
ECR Repository URI: $ECR_URI
ECS Cluster Name: $ECS_CLUSTER

## API URLs
Dev Environment: http://$LOAD_BALANCER_DNS/api
Production Environment: http://$LOAD_BALANCER_DNS:8080/api

## Mobile App Configuration
Update mobile-ui/src/config/environment.js:
PROD_SERVER_URL = "http://$LOAD_BALANCER_DNS:8080/api"

## Next Steps
1. Push your code to GitHub to trigger the first build
2. Monitor the pipeline in AWS CodePipeline console
3. Build your mobile app: cd mobile-ui && eas build --platform android --profile production
4. Upload APK to Google Play Console

## Important
- Keep these credentials secure
- The pipeline will automatically deploy to dev on code push
- Manual approval required for production deployment
EOF

echo "✅ Credentials saved to deployment/credentials.txt"

# Final summary
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "📊 Deployment Summary:"
echo "  Load Balancer: $LOAD_BALANCER_DNS"
echo "  ECR Repository: $ECR_URI"
echo "  ECS Cluster: $ECS_CLUSTER"
echo ""
echo "🔗 Important Links:"
echo "  AWS Console: https://console.aws.amazon.com"
echo "  CodePipeline: https://console.aws.amazon.com/codesuite/codepipeline"
echo "  ECS Console: https://console.aws.amazon.com/ecs"
echo ""
echo "📱 Mobile App URLs:"
echo "  Dev Environment: http://$LOAD_BALANCER_DNS/api"
echo "  Production: http://$LOAD_BALANCER_DNS:8080/api"
echo ""
echo "🚀 Next Steps:"
echo "  1. Push code to GitHub: git push origin main"
echo "  2. Monitor pipeline in AWS console"
echo "  3. Build mobile app: cd mobile-ui && eas build --platform android --profile production"
echo "  4. Upload APK to Google Play Console"
echo ""
echo "📄 Full documentation: AWS_DEPLOYMENT_GUIDE.md"
echo "🔐 Credentials saved: deployment/credentials.txt"
echo ""
echo "Happy coding! 🎯"
