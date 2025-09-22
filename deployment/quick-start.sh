#!/bin/bash

# Quick Start Script for Kids Piggy Bank Deployment
# This script automates the initial setup process

set -e

echo "🚀 Kids Piggy Bank - Quick Start Deployment"
echo "=============================================="

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install it first:"
    echo "   https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install it first:"
    echo "   https://nodejs.org/"
    exit 1
fi

# Check EAS CLI
if ! command -v eas &> /dev/null; then
    echo "📦 Installing EAS CLI..."
    npm install -g @expo/eas-cli
fi

echo "✅ Prerequisites check passed!"

# Get user input
echo ""
echo "🔧 Configuration Setup"
echo "======================"

read -p "Enter your AWS region (default: us-east-1): " AWS_REGION
AWS_REGION=${AWS_REGION:-us-east-1}

read -p "Enter your EC2 key pair name: " KEY_PAIR_NAME
if [ -z "$KEY_PAIR_NAME" ]; then
    echo "❌ Key pair name is required!"
    exit 1
fi

read -p "Enter your domain name (optional): " DOMAIN_NAME

read -s -p "Enter database password (min 8 chars): " DB_PASSWORD
echo ""
if [ ${#DB_PASSWORD} -lt 8 ]; then
    echo "❌ Database password must be at least 8 characters!"
    exit 1
fi

read -s -p "Enter JWT secret (min 32 chars): " JWT_SECRET
echo ""
if [ ${#JWT_SECRET} -lt 32 ]; then
    echo "❌ JWT secret must be at least 32 characters!"
    exit 1
fi

read -p "Enter S3 bucket name for deployments: " S3_BUCKET_NAME
if [ -z "$S3_BUCKET_NAME" ]; then
    echo "❌ S3 bucket name is required!"
    exit 1
fi

# Set environment variables
export AWS_REGION
export KEY_PAIR_NAME
export DOMAIN_NAME
export DB_PASSWORD
export JWT_SECRET
export S3_BUCKET_NAME

echo ""
echo "🌐 Deploying AWS Infrastructure..."
echo "=================================="

# Deploy CloudFormation stack
aws cloudformation create-stack \
  --stack-name kids-piggy-bank \
  --template-body file://deployment/aws-infrastructure.yml \
  --parameters \
    ParameterKey=KeyPairName,ParameterValue=$KEY_PAIR_NAME \
    ParameterKey=DomainName,ParameterValue=$DOMAIN_NAME \
    ParameterKey=DBPassword,ParameterValue=$DB_PASSWORD \
    ParameterKey=JWTSecret,ParameterValue=$JWT_SECRET \
  --capabilities CAPABILITY_IAM \
  --region $AWS_REGION

echo "⏳ Waiting for stack creation to complete..."
aws cloudformation wait stack-create-complete --stack-name kids-piggy-bank --region $AWS_REGION

# Get stack outputs
echo "📊 Getting stack outputs..."
STACK_OUTPUTS=$(aws cloudformation describe-stacks \
  --stack-name kids-piggy-bank \
  --region $AWS_REGION \
  --query 'Stacks[0].Outputs')

DB_ENDPOINT=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="DatabaseEndpoint") | .OutputValue')
WEB_SERVER_IP=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="WebServerPublicIP") | .OutputValue')
LOAD_BALANCER_DNS=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="LoadBalancerDNS") | .OutputValue')

echo "✅ Infrastructure deployed successfully!"
echo ""
echo "📋 Deployment Information:"
echo "=========================="
echo "Database Endpoint: $DB_ENDPOINT"
echo "Web Server IP: $WEB_SERVER_IP"
echo "Load Balancer DNS: $LOAD_BALANCER_DNS"
echo ""

# Set up database
echo "🗄️ Setting up database..."
echo "Please run the following commands to set up your database:"
echo ""
echo "1. Connect to your database:"
echo "   mysql -h $DB_ENDPOINT -u admin -p"
echo ""
echo "2. Run the database scripts:"
echo "   source server/src/main/resources/sql/01_create_database.sql;"
echo "   source server/src/main/resources/sql/02_create_tables.sql;"
echo "   source server/src/main/resources/sql/03_create_indexes.sql;"
echo "   source server/src/main/resources/sql/04_sample_data.sql;"
echo ""

# Deploy application
read -p "Do you want to deploy the application now? (y/n): " DEPLOY_APP
if [ "$DEPLOY_APP" = "y" ] || [ "$DEPLOY_APP" = "Y" ]; then
    echo "🚀 Deploying application..."
    
    # Set additional environment variables
    export EC2_INSTANCE_ID=$(aws ec2 describe-instances \
      --filters "Name=tag:Name,Values=PiggyBank-WebServer" \
      --query 'Reservations[0].Instances[0].InstanceId' \
      --output text \
      --region $AWS_REGION)
    
    export DB_HOST=$DB_ENDPOINT
    export DB_USERNAME="admin"
    export CORS_ALLOWED_ORIGINS="https://$DOMAIN_NAME,https://www.$DOMAIN_NAME"
    
    # Create S3 bucket
    aws s3 mb s3://$S3_BUCKET_NAME --region $AWS_REGION
    
    # Deploy application
    chmod +x deployment/aws-deploy.sh
    ./deployment/aws-deploy.sh
    
    echo "✅ Application deployed successfully!"
fi

# Mobile app setup
echo ""
echo "📱 Mobile App Setup"
echo "==================="
echo "To build and deploy your mobile app:"
echo ""
echo "1. Update your production API URL in mobile-ui/src/config/environment.js"
echo "2. Run: cd mobile-ui && npm install"
echo "3. Run: eas login"
echo "4. Run: eas build:configure"
echo "5. Run: node scripts/build-production.js"
echo ""

# SSL setup
if [ ! -z "$DOMAIN_NAME" ]; then
    echo "🔒 SSL Certificate Setup"
    echo "========================"
    echo "To set up SSL for your domain:"
    echo ""
    echo "1. Request certificate from AWS Certificate Manager:"
    echo "   aws acm request-certificate --domain-name $DOMAIN_NAME --subject-alternative-names www.$DOMAIN_NAME --validation-method DNS"
    echo ""
    echo "2. Validate domain ownership"
    echo "3. Update Load Balancer to use HTTPS"
    echo ""
fi

echo "🎉 Quick start deployment completed!"
echo ""
echo "📚 Next Steps:"
echo "=============="
echo "1. Set up your database (see instructions above)"
echo "2. Configure SSL certificate (if using custom domain)"
echo "3. Build and deploy mobile app"
echo "4. Test your application"
echo "5. Set up monitoring and alerts"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🔗 Your application will be available at:"
echo "   http://$LOAD_BALANCER_DNS"
if [ ! -z "$DOMAIN_NAME" ]; then
    echo "   https://$DOMAIN_NAME (after SSL setup)"
fi
