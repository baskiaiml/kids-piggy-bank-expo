#!/bin/bash

# AWS Deployment Script for Kids Piggy Bank Server
# Make sure to set the following environment variables:
# - AWS_REGION (e.g., us-east-1)
# - EC2_INSTANCE_ID (your EC2 instance ID)
# - S3_BUCKET_NAME (for storing deployment artifacts)
# - DB_HOST (RDS endpoint)
# - DB_USERNAME
# - DB_PASSWORD
# - JWT_SECRET
# - CORS_ALLOWED_ORIGINS

set -e

echo "🚀 Starting AWS deployment for Kids Piggy Bank Server..."

# Check required environment variables
required_vars=("AWS_REGION" "EC2_INSTANCE_ID" "S3_BUCKET_NAME" "DB_HOST" "DB_USERNAME" "DB_PASSWORD" "JWT_SECRET")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Error: Environment variable $var is not set"
        exit 1
    fi
done

# Build the application
echo "📦 Building Spring Boot application..."
cd server
./mvnw clean package -DskipTests -Pprod

# Create deployment directory
DEPLOY_DIR="../deployment/temp"
mkdir -p $DEPLOY_DIR

# Copy JAR file
cp target/piggy-bank-*.jar $DEPLOY_DIR/app.jar

# Create systemd service file
cat > $DEPLOY_DIR/piggy-bank.service << EOF
[Unit]
Description=Kids Piggy Bank Application
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/piggy-bank
ExecStart=/usr/bin/java -jar /opt/piggy-bank/app.jar --spring.profiles.active=prod
Restart=always
RestartSec=10
Environment=DB_HOST=${DB_HOST}
Environment=DB_USERNAME=${DB_USERNAME}
Environment=DB_PASSWORD=${DB_PASSWORD}
Environment=JWT_SECRET=${JWT_SECRET}
Environment=CORS_ALLOWED_ORIGINS=${CORS_ALLOWED_ORIGINS:-https://yourdomain.com}

[Install]
WantedBy=multi-user.target
EOF

# Create deployment script
cat > $DEPLOY_DIR/deploy.sh << 'EOF'
#!/bin/bash
set -e

echo "🔄 Deploying application on EC2..."

# Stop existing service
sudo systemctl stop piggy-bank || true

# Create application directory
sudo mkdir -p /opt/piggy-bank
sudo chown ubuntu:ubuntu /opt/piggy-bank

# Copy new JAR
sudo cp app.jar /opt/piggy-bank/

# Copy service file
sudo cp piggy-bank.service /etc/systemd/system/

# Reload systemd and start service
sudo systemctl daemon-reload
sudo systemctl enable piggy-bank
sudo systemctl start piggy-bank

# Check status
sleep 5
sudo systemctl status piggy-bank --no-pager

echo "✅ Deployment completed successfully!"
EOF

chmod +x $DEPLOY_DIR/deploy.sh

# Upload to S3
echo "☁️ Uploading deployment package to S3..."
aws s3 cp $DEPLOY_DIR s3://$S3_BUCKET_NAME/deployment/ --recursive

# Deploy to EC2
echo "🚀 Deploying to EC2 instance..."
aws ssm send-command \
    --instance-ids $EC2_INSTANCE_ID \
    --document-name "AWS-RunShellScript" \
    --parameters 'commands=[
        "cd /tmp",
        "aws s3 cp s3://'$S3_BUCKET_NAME'/deployment/ . --recursive",
        "chmod +x deploy.sh",
        "./deploy.sh"
    ]' \
    --region $AWS_REGION

echo "✅ Deployment initiated! Check EC2 instance for status."

# Cleanup
rm -rf $DEPLOY_DIR

echo "🎉 Deployment process completed!"
