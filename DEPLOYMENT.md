# Deployment Guide for Linux

## Prerequisites
- Node.js (v18 or later)
- npm
- PM2 (for process management)
- Nginx (for reverse proxy)
- SQLite3

## Step 1: Prepare Your Application

1. Build the frontend:
```bash
npm run build
```

2. Create a `.env` file in the server directory with your production settings:
```env
PORT=3002
DB_PATH=/var/www/html/picture-management/server/database.sqlite
JWT_SECRET=your_jwt_secret
```

## Step 2: Set Up the Server

1. Install Node.js and npm:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. Install PM2 globally:
```bash
sudo npm install -g pm2
```

3. Install Nginx:
```bash
sudo apt update
sudo apt install nginx
```

4. Install SQLite3:
```bash
sudo apt install sqlite3
```

## Step 3: Deploy the Application

1. Create a directory for your application:
```bash
sudo mkdir -p /var/www/html/picture-management
```

2. Copy your application files:
```bash
# Copy frontend build
sudo cp -r dist/* /var/www/html/picture-management/

# Copy server files
sudo cp -r server/* /var/www/html/picture-management/server/
```

3. Install dependencies:
```bash
cd /var/www/html/picture-management/server
npm install --production
```

4. Initialize SQLite database:
```bash
cd /var/www/html/picture-management/server
sqlite3 database.sqlite < schema.sql  # If you have a schema file
# Or let the application create the database on first run
```

5. Start the application with PM2:
```bash
cd /var/www/html/picture-management/server
pm2 start index.js --name "picture-management"
pm2 save
pm2 startup
```

## Step 4: Configure Nginx

1. Create an Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/picture-management
```

2. Add the following configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain

    # Frontend
    location / {
        root /var/www/html/picture-management;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads directory
    location /uploads {
        alias /var/www/html/picture-management/server/uploads;
    }
}
```

3. Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/picture-management /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 5: Set Up SSL (Optional but Recommended)

1. Install Certbot:
```bash
sudo apt install certbot python3-certbot-nginx
```

2. Obtain SSL certificate:
```bash
sudo certbot --nginx -d your-domain.com
```

## Step 6: File Permissions

1. Set proper permissions:
```bash
sudo chown -R www-data:www-data /var/www/html/picture-management
sudo chmod -R 755 /var/www/html/picture-management
sudo chmod -R 777 /var/www/html/picture-management/server/uploads
sudo chmod 664 /var/www/html/picture-management/server/database.sqlite
```

## Monitoring and Maintenance

1. Monitor your application:
```bash
pm2 monit
```

2. View logs:
```bash
pm2 logs picture-management
```

3. Restart application:
```bash
pm2 restart picture-management
```

## Troubleshooting

1. Check Nginx error logs:
```bash
sudo tail -f /var/log/nginx/error.log
```

2. Check application logs:
```bash
pm2 logs picture-management
```

3. Check database:
```bash
sqlite3 /var/www/html/picture-management/server/database.sqlite
```

## Backup

1. Create a backup script:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/picture-management"
mkdir -p $BACKUP_DIR
cp /var/www/html/picture-management/server/database.sqlite $BACKUP_DIR/db_backup_$(date +%Y%m%d).sqlite
tar -czf $BACKUP_DIR/uploads_$(date +%Y%m%d).tar.gz /var/www/html/picture-management/server/uploads
```

Remember to:
- Replace `your-domain.com` with your actual domain
- Update JWT secret in the `.env` file
- Set up proper firewall rules
- Configure regular backups
- Monitor server resources
- Set up proper logging

For a production deployment, I strongly recommend using Git. Here's why:

1. **Version Control**: Git helps you track changes and roll back if needed
2. **Deployment Safety**: You can test changes in a staging environment before deploying to production
3. **Collaboration**: If you need to work with others or get help, Git makes it easier
4. **Backup**: Your code is backed up in the repository
5. **Deployment Automation**: Makes it easier to set up CI/CD pipelines

However, if you want to quickly test the deployment, you can transfer the files directly. Here's how you can do both:

### Option 1: Direct File Transfer (Quick Test)

1. First, build your frontend:
```bash
npm run build
```

2. Create a zip file of your project:
```bash
# On Windows PowerShell
Compress-Archive -Path dist,server -DestinationPath picture-management.zip
```

3. Transfer to your Linux server using SCP:
```bash
scp picture-management.zip user@your-server-ip:/tmp/
```

4. On your Linux server:
```bash
cd /tmp
unzip picture-management.zip
sudo mv picture-management /var/www/
cd /var/www/picture-management/server
npm install --production
```

### Option 2: Git Deployment (Recommended)

1. Initialize Git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a repository on GitHub/GitLab/Bitbucket

3. Push your code:
```bash
git remote add origin your-repository-url
git push -u origin main
```

4. On your Linux server:
```bash
# Install Git if not already installed
sudo apt install git

# Clone the repository
sudo git clone your-repository-url /var/www/picture-management

# Build and deploy
cd /var/www/picture-management
npm run build
cd server
npm install --production
```

I recommend going with Option 2 (Git) because:
1. It's easier to update your application later
2. You can track changes
3. You can easily roll back if something goes wrong
4. It's the standard way to deploy applications

Would you like me to help you set up either of these options? I can provide more detailed steps for whichever approach you prefer.


