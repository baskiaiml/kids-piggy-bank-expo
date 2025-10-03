#!/bin/bash

# EC2 Deployment Script for Kids Piggy Bank
# This script sets up the EC2 instance for GitHub Actions deployment

set -e

echo "🚀 Setting up EC2 instance for GitHub Actions deployment..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
sudo apt install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Install Java 17 (for local development/testing)
echo "☕ Installing Java 17..."
sudo apt install -y openjdk-17-jdk

# Install Maven (for local development/testing)
echo "📚 Installing Maven..."
sudo apt install -y maven

# Install MySQL client (for database management)
echo "🗄️ Installing MySQL client..."
sudo apt install -y mysql-client

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /opt/kids-piggy-bank
sudo chown $USER:$USER /opt/kids-piggy-bank

# Create logs directory
echo "📝 Creating logs directory..."
sudo mkdir -p /var/log/kids-piggy-bank
sudo chown $USER:$USER /var/log/kids-piggy-bank

# Install monitoring tools
echo "📊 Installing monitoring tools..."
sudo apt install -y htop iotop nethogs

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 22    # SSH
sudo ufw allow 8080  # Application
sudo ufw allow 3306  # MySQL (if using local DB)
sudo ufw --force enable

# Create systemd service for manual deployment (optional)
echo "⚙️ Creating systemd service..."
sudo tee /etc/systemd/system/kids-piggy-bank.service > /dev/null << 'EOF'
[Unit]
Description=Kids Piggy Bank Application
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/kids-piggy-bank
ExecStart=/usr/bin/docker run -d --name kids-piggy-bank --restart unless-stopped -p 8080:8080 kids-piggy-bank:latest
ExecStop=/usr/bin/docker stop kids-piggy-bank
ExecReload=/usr/bin/docker restart kids-piggy-bank

[Install]
WantedBy=multi-user.target
EOF

# Create health check script
echo "🏥 Creating health check script..."
tee /home/$USER/health-check.sh > /dev/null << 'EOF'
#!/bin/bash

APP_URL="http://localhost:8080/api/health"
LOG_FILE="/var/log/kids-piggy-bank/health-check.log"

check_health() {
    if curl -f -s "$APP_URL" > /dev/null 2>&1; then
        echo "$(date): ✅ Application is healthy" >> "$LOG_FILE"
        return 0
    else
        echo "$(date): ❌ Application health check failed" >> "$LOG_FILE"
        return 1
    fi
}

check_health
EOF

chmod +x /home/$USER/health-check.sh

# Create log rotation configuration
echo "📋 Setting up log rotation..."
sudo tee /etc/logrotate.d/kids-piggy-bank > /dev/null << 'EOF'
/var/log/kids-piggy-bank/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 ubuntu ubuntu
}
EOF

# Create backup script
echo "💾 Creating backup script..."
tee /home/$USER/backup.sh > /dev/null << 'EOF'
#!/bin/bash

BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

# Backup application logs
tar -czf "$BACKUP_DIR/app-logs-$DATE.tar.gz" /var/log/kids-piggy-bank/

# Backup Docker images
docker save kids-piggy-bank:latest | gzip > "$BACKUP_DIR/docker-image-$DATE.tar.gz"

# Clean old backups (keep last 7 days)
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /home/$USER/backup.sh

# Set up cron jobs
echo "⏰ Setting up cron jobs..."
(crontab -l 2>/dev/null; echo "0 2 * * * /home/$USER/backup.sh") | crontab -
(crontab -l 2>/dev/null; echo "*/5 * * * * /home/$USER/health-check.sh") | crontab -

# Create environment file template
echo "🔧 Creating environment file template..."
tee /home/$USER/.env.template > /dev/null << 'EOF'
# Database Configuration
DB_HOST=your-rds-endpoint.ap-south-1.rds.amazonaws.com
DB_PORT=3306
DB_NAME=kids_piggy_bank
DB_USERNAME=admin
DB_PASSWORD=your-secure-password

# Application Configuration
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=your-jwt-secret-key
SERVER_PORT=8080

# AWS Configuration
AWS_REGION=ap-south-1
EOF

echo "✅ EC2 instance setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Configure GitHub Secrets:"
echo "   - AWS_ACCESS_KEY_ID"
echo "   - AWS_SECRET_ACCESS_KEY"
echo "   - EC2_INSTANCE_ID"
echo "   - DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD"
echo "   - JWT_SECRET"
echo ""
echo "2. Set up SSH key for GitHub Actions:"
echo "   - Generate SSH key: ssh-keygen -t rsa -b 4096 -C 'github-actions'"
echo "   - Add public key to EC2: ~/.ssh/authorized_keys"
echo "   - Add private key to GitHub Secrets: EC2_SSH_KEY"
echo ""
echo "3. Test deployment by pushing to main branch"
echo ""
echo "🔧 Useful commands:"
echo "   - Check application status: docker ps"
echo "   - View logs: docker logs kids-piggy-bank"
echo "   - Restart application: docker restart kids-piggy-bank"
echo "   - Health check: ./health-check.sh"
echo "   - Manual backup: ./backup.sh"
