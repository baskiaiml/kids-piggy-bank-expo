#!/bin/bash
# deployment/deploy-infrastructure.sh
# Deploys ECS Fargate infrastructure with RDS MySQL

set -e

echo "🚀 Deploying Kids Piggy Bank Infrastructure to AWS..."

# Configuration
STACK_NAME="KidsPiggyBankInfrastructure"
REGION="us-east-1"
TEMPLATE_FILE="ecs-fargate-infrastructure.yml"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install it first."
    exit 1
fi

# Check if parameters are provided
if [ $# -lt 3 ]; then
    echo "Usage: $0 <GitHubOwner> <GitHubRepo> <GitHubToken> [DBPassword] [JWTSecret]"
    echo "Example: $0 yourusername kids-piggy-bank-expo ghp_xxxxxxxxxxxx"
    exit 1
fi

GITHUB_OWNER=$1
GITHUB_REPO=$2
GITHUB_TOKEN=$3
DB_PASSWORD=${4:-$(openssl rand -base64 32)}
JWT_SECRET=${5:-$(openssl rand -base64 64)}

echo "📋 Configuration:"
echo "  Stack Name: $STACK_NAME"
echo "  Region: $REGION"
echo "  GitHub Owner: $GITHUB_OWNER"
echo "  GitHub Repo: $GITHUB_REPO"
echo "  Database Password: [HIDDEN]"
echo "  JWT Secret: [HIDDEN]"

# Deploy CloudFormation stack
echo "🏗️  Deploying CloudFormation stack..."
aws cloudformation deploy \
    --template-file $TEMPLATE_FILE \
    --stack-name $STACK_NAME \
    --capabilities CAPABILITY_IAM \
    --region $REGION \
    --parameter-overrides \
        GitHubOwner="$GITHUB_OWNER" \
        GitHubRepo="$GITHUB_REPO" \
        GitHubBranch="main" \
        GitHubToken="$GITHUB_TOKEN" \
        DBPassword="$DB_PASSWORD" \
        JWTSecret="$JWT_SECRET" \
    --no-fail-on-empty-changeset

echo "⏳ Waiting for stack deployment to complete..."
aws cloudformation wait stack-create-complete --stack-name $STACK_NAME --region $REGION || \
aws cloudformation wait stack-update-complete --stack-name $STACK_NAME --region $REGION

if [ $? -eq 0 ]; then
    echo "✅ Infrastructure deployed successfully!"
    
    # Get outputs
    echo "📊 Retrieving deployment outputs..."
    LOAD_BALANCER_DNS=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --region $REGION \
        --query "Stacks[0].Outputs[?OutputKey=='LoadBalancerDNS'].OutputValue" \
        --output text)
    
    DB_ENDPOINT=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --region $REGION \
        --query "Stacks[0].Outputs[?OutputKey=='DatabaseEndpoint'].OutputValue" \
        --output text)
    
    ECR_URI=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --region $REGION \
        --query "Stacks[0].Outputs[?OutputKey=='ECRRepositoryURI'].OutputValue" \
        --output text)
    
    echo ""
    echo "🎉 Deployment Complete!"
    echo "=================================="
    echo "Load Balancer DNS: $LOAD_BALANCER_DNS"
    echo "Database Endpoint: $DB_ENDPOINT"
    echo "ECR Repository URI: $ECR_URI"
    echo ""
    echo "📱 Update your mobile app configuration:"
    echo "   In mobile-ui/src/config/environment.js:"
    echo "   PROD_SERVER_URL = \"http://$LOAD_BALANCER_DNS:8080/api\""
    echo ""
    echo "🔧 Next steps:"
    echo "   1. Update mobile app with production URL"
    echo "   2. Build and deploy mobile app to Play Store"
    echo "   3. Push code to GitHub to trigger CI/CD pipeline"
    echo ""
    echo "💾 Save these credentials securely:"
    echo "   Database Password: $DB_PASSWORD"
    echo "   JWT Secret: $JWT_SECRET"
    
else
    echo "❌ Infrastructure deployment failed!"
    exit 1
fi
