#!/bin/bash
# deployment/deploy-pipeline.sh
# Deploys CodePipeline for CI/CD

set -e

echo "🔄 Deploying CodePipeline for CI/CD..."

# Configuration
STACK_NAME="KidsPiggyBankPipeline"
REGION="us-east-1"
TEMPLATE_FILE="deployment/codepipeline.yml"

# Check if parameters are provided
if [ $# -lt 4 ]; then
    echo "Usage: $0 <GitHubOwner> <GitHubRepo> <GitHubToken> <ECRRepositoryURI> <ECSClusterName> <DevServiceName> <ProdServiceName>"
    echo "Example: $0 yourusername kids-piggy-bank-expo ghp_xxxxxxxxxxxx 123456789.dkr.ecr.us-east-1.amazonaws.com/kids-piggy-bank piggy-bank-cluster piggy-bank-dev-service piggy-bank-prod-service"
    exit 1
fi

GITHUB_OWNER=$1
GITHUB_REPO=$2
GITHUB_TOKEN=$3
ECR_REPOSITORY_URI=$4
ECS_CLUSTER_NAME=$5
DEV_SERVICE_NAME=$6
PROD_SERVICE_NAME=$7

echo "📋 Pipeline Configuration:"
echo "  Stack Name: $STACK_NAME"
echo "  Region: $REGION"
echo "  GitHub Owner: $GITHUB_OWNER"
echo "  GitHub Repo: $GITHUB_REPO"
echo "  ECR Repository: $ECR_REPOSITORY_URI"
echo "  ECS Cluster: $ECS_CLUSTER_NAME"
echo "  Dev Service: $DEV_SERVICE_NAME"
echo "  Prod Service: $PROD_SERVICE_NAME"

# Deploy CloudFormation stack
echo "🏗️  Deploying CodePipeline stack..."
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
        ECRRepositoryURI="$ECR_REPOSITORY_URI" \
        ECSClusterName="$ECS_CLUSTER_NAME" \
        DevServiceName="$DEV_SERVICE_NAME" \
        ProdServiceName="$PROD_SERVICE_NAME" \
    --no-fail-on-empty-changeset

echo "⏳ Waiting for pipeline deployment to complete..."
aws cloudformation wait stack-create-complete --stack-name $STACK_NAME --region $REGION || \
aws cloudformation wait stack-update-complete --stack-name $STACK_NAME --region $REGION

if [ $? -eq 0 ]; then
    echo "✅ CodePipeline deployed successfully!"
    
    # Get pipeline name
    PIPELINE_NAME=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --region $REGION \
        --query "Stacks[0].Outputs[?OutputKey=='PipelineName'].OutputValue" \
        --output text)
    
    echo ""
    echo "🎉 Pipeline Setup Complete!"
    echo "=================================="
    echo "Pipeline Name: $PIPELINE_NAME"
    echo ""
    echo "🔄 CI/CD Pipeline Features:"
    echo "  ✅ Automatic build on code push"
    echo "  ✅ Deploy to dev environment automatically"
    echo "  ✅ Manual approval required for production"
    echo "  ✅ Docker image building and pushing to ECR"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Push code to GitHub to trigger first build"
    echo "   2. Monitor pipeline in AWS CodePipeline console"
    echo "   3. Approve production deployment when ready"
    echo ""
    echo "🔗 View pipeline: https://console.aws.amazon.com/codesuite/codepipeline/pipelines/$PIPELINE_NAME/view"
    
else
    echo "❌ Pipeline deployment failed!"
    exit 1
fi
