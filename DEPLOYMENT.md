# Deployment Guide

## Quick Start (Local Development)

```bash
# 1. Clone and setup
git clone <repository>
cd ecommerce
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Create .env file
cp .env.example .env

# 4. Run development server
python app.py
```

Visit `http://localhost:5000`

---

## Production Deployment

### Option 1: Heroku Deployment

#### Prerequisites
- Heroku account
- Heroku CLI installed

#### Steps
```bash
# 1. Create Procfile
echo "web: gunicorn app:app" > Procfile

# 2. Create runtime.txt
echo "python-3.9.16" > runtime.txt

# 3. Login to Heroku
heroku login

# 4. Create app
heroku create your-app-name

# 5. Set environment variables
heroku config:set SECRET_KEY=your-strong-secret-key
heroku config:set RAZORPAY_KEY_ID=your-key-id
heroku config:set RAZORPAY_KEY_SECRET=your-key-secret
heroku config:set FLASK_ENV=production

# 6. Deploy
git push heroku main
```

### Option 2: AWS Deployment (EC2)

#### Prerequisites
- AWS account
- EC2 instance (Ubuntu 20.04)
- Domain name

#### Steps
```bash
# 1. SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-instance-ip

# 2. Update system
sudo apt update
sudo apt upgrade -y

# 3. Install dependencies
sudo apt install -y python3-pip python3-venv nginx

# 4. Clone repository
cd /home/ubuntu
git clone <your-repo>
cd ecommerce

# 5. Setup Python environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn

# 6. Create .env file
nano .env
# Add your credentials

# 7. Create systemd service file
sudo nano /etc/systemd/system/app.service
```

#### Systemd Service File
```ini
[Unit]
Description=U.S ATELIER Ecommerce
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/ecommerce
Environment="PATH=/home/ubuntu/ecommerce/venv/bin"
EnvironmentFile=/home/ubuntu/ecommerce/.env
ExecStart=/home/ubuntu/ecommerce/venv/bin/gunicorn -w 4 -b 127.0.0.1:8000 app:app
Restart=always

[Install]
WantedBy=multi-user.target
```

Continue systemd setup:
```bash
# 8. Enable service
sudo systemctl enable app.service
sudo systemctl start app.service

# 9. Configure Nginx
sudo nano /etc/nginx/sites-available/default
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    ssl_certificate /path/to/certificate.pem;
    ssl_certificate_key /path/to/private_key.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    client_max_body_size 10M;
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    
    # Cache static files
    location /static {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Continue Nginx setup:
```bash
# 10. Test Nginx config
sudo nginx -t

# 11. Restart Nginx
sudo systemctl restart nginx

# 12. Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com -d www.your-domain.com
```

### Option 3: DigitalOcean App Platform

#### Prerequisites
- DigitalOcean account
- GitHub repository

#### Steps
1. Log in to DigitalOcean
2. Go to App Platform → Create App
3. Connect GitHub repository
4. Select Python as runtime
5. Set environment variables
6. Deploy

---

## Docker Deployment

### Create Dockerfile
```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y gcc

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Set environment
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# Expose port
EXPOSE 8000

# Run gunicorn
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "--timeout", "120", "app:app"]
```

### Create docker-compose.yml
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8000:8000"
    environment:
      - SECRET_KEY=${SECRET_KEY}
      - RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID}
      - RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET}
      - FLASK_ENV=production
    volumes:
      - ./:/app
    restart: always
```

### Deploy Docker
```bash
# Build image
docker build -t us-atelier .

# Run container
docker run -p 8000:8000 \
  -e SECRET_KEY=your-secret \
  -e RAZORPAY_KEY_ID=your-key \
  -e RAZORPAY_KEY_SECRET=your-secret \
  -e FLASK_ENV=production \
  us-atelier

# Or using docker-compose
docker-compose up -d
```

---

## Database Migration (PostgreSQL)

### Install PostgreSQL
```bash
# macOS
brew install postgresql

# Ubuntu
sudo apt install postgresql postgresql-contrib

# Windows
# Download installer from postgresql.org
```

### Setup Database
```bash
# Create database
createdb us_atelier

# Create user
createuser -P atelier_user  # Enter password when prompted

# Connect and initialize
psql -U atelier_user -d us_atelier
```

### Update App for Database
```python
from sqlalchemy import create_engine
import os

DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://atelier_user:password@localhost/us_atelier')

engine = create_engine(DATABASE_URL)

# Use SQLAlchemy for models and queries
```

---

## Environment Variables

### Development (.env)
```
SECRET_KEY=dev-secret-key-change-in-production
FLASK_ENV=development
FLASK_DEBUG=True
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

### Production (.env)
```
SECRET_KEY=<strong-32-char-random-key>
FLASK_ENV=production
FLASK_DEBUG=False
RAZORPAY_KEY_ID=<your-production-key>
RAZORPAY_KEY_SECRET=<your-production-secret>
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

---

## Monitoring & Logging

### Setup Logging
```bash
# Create log directory
mkdir -p /var/log/app
chmod 755 /var/log/app

# Create log rotation config
sudo nano /etc/logrotate.d/app
```

### Logrotate Configuration
```
/var/log/app/*.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    create 0640 ubuntu ubuntu
    sharedscripts
    postrotate
        systemctl reload app.service
    endscript
}
```

### Monitor Application
```bash
# Check service status
sudo systemctl status app.service

# View logs
sudo journalctl -u app.service -f

# Check Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## Backup Strategy

### Database Backup
```bash
# Backup PostgreSQL
pg_dump -U atelier_user us_atelier > backup_$(date +%Y%m%d).sql

# Restore from backup
psql -U atelier_user us_atelier < backup_20240101.sql
```

### Automated Backups
```bash
# Create backup script
cat > /home/ubuntu/backup.sh << 'EOF'
#!/bin/bash
pg_dump -U atelier_user us_atelier > /backups/db_$(date +%Y%m%d_%H%M%S).sql
find /backups -name "db_*.sql" -mtime +30 -delete
EOF

# Make executable
chmod +x /home/ubuntu/backup.sh

# Add to crontab (daily backup)
crontab -e
# Add: 0 2 * * * /home/ubuntu/backup.sh
```

---

## Troubleshooting

### Application Won't Start
```bash
# Check logs
sudo journalctl -u app.service -n 50

# Check port usage
sudo lsof -i :8000

# Test Flask app directly
python3 app.py
```

### Payment Gateway Issues
```bash
# Check Razorpay credentials
curl -X GET https://api.razorpay.com/v1/payments \
  -u KEY_ID:KEY_SECRET

# Verify endpoint
curl -X GET http://localhost:5000/health
```

### Database Connection Issues
```bash
# Test connection
psql -U atelier_user -d us_atelier -h localhost

# Check environment variables
echo $DATABASE_URL
```

---

## Performance Optimization

### Enable Caching
- Implement Redis for session caching
- Cache product listings
- Cache frequently accessed endpoints

### Use CDN
- CloudFlare for static assets
- AWS CloudFront for global distribution

### Database Optimization
- Add indexes on frequently queried fields
- Use connection pooling
- Implement query caching

---

## Scaling Considerations

1. **Horizontal Scaling**
   - Load balancer (nginx/HAProxy)
   - Multiple app instances
   - Shared database backend

2. **Vertical Scaling**
   - Larger instance (more CPU/RAM)
   - Database optimization
   - Caching layers

3. **Database Scaling**
   - Read replicas
   - Connection pooling
   - Database sharding

---

## Support

For deployment questions or issues, refer to:
- Flask Deployment Guide: https://flask.palletsprojects.com/deployment/
- Gunicorn Documentation: https://gunicorn.org/
- Nginx Documentation: https://nginx.org/
- AWS Documentation: https://docs.aws.amazon.com/
