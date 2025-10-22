# Deployment Guide

This guide provides step-by-step instructions for deploying the Picture Guessing Game to various platforms.

## Prerequisites

- Node.js 14+ installed
- npm or yarn package manager
- A Nana Banana API key
- Git installed

## Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/TienxDun/TienxDun.github.io.git
cd TienxDun.github.io
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your API key:
```
NANA_BANANA_API_KEY=your_actual_api_key
PORT=3000
NODE_ENV=development
```

### 4. Run the Application

```bash
npm start
```

Visit `http://localhost:3000`

### 5. Development Mode (Auto-reload)

```bash
npm run dev
```

## Deploying to Heroku

### 1. Install Heroku CLI

```bash
# macOS
brew install heroku

# Ubuntu
curl https://cli-assets.heroku.com/install.sh | sh
```

### 2. Login to Heroku

```bash
heroku login
```

### 3. Create Heroku App

```bash
heroku create your-app-name
```

### 4. Set Environment Variables

```bash
heroku config:set NANA_BANANA_API_KEY=your_api_key
heroku config:set NODE_ENV=production
```

### 5. Deploy

```bash
git push heroku main
```

### 6. Open Your App

```bash
heroku open
```

## Deploying to Railway

### 1. Create Account

Visit [railway.app](https://railway.app) and sign up

### 2. New Project

- Click "New Project"
- Select "Deploy from GitHub repo"
- Connect your repository

### 3. Configure Environment

In the Railway dashboard:
- Go to Variables
- Add `NANA_BANANA_API_KEY`
- Add `PORT` (Railway will auto-assign if not set)

### 4. Deploy

Railway will automatically deploy on every push to the main branch.

## Deploying to Render

### 1. Create Account

Visit [render.com](https://render.com) and sign up

### 2. New Web Service

- Click "New +"
- Select "Web Service"
- Connect your GitHub repository

### 3. Configure Service

```
Name: picture-guessing-game
Environment: Node
Build Command: npm install
Start Command: npm start
```

### 4. Add Environment Variables

In the Render dashboard:
- Add `NANA_BANANA_API_KEY`
- Add `NODE_ENV=production`

### 5. Deploy

Click "Create Web Service" - Render will automatically deploy.

## Deploying to DigitalOcean App Platform

### 1. Create Account

Visit [digitalocean.com](https://www.digitalocean.com) and sign up

### 2. Create App

- Go to Apps
- Click "Create App"
- Connect to GitHub
- Select your repository

### 3. Configure

```
Name: picture-guessing-game
HTTP Port: 3000
Build Command: npm install
Run Command: npm start
```

### 4. Environment Variables

Add in the App settings:
- `NANA_BANANA_API_KEY`
- `NODE_ENV=production`

### 5. Deploy

DigitalOcean will build and deploy automatically.

## Deploying to AWS EC2

### 1. Launch EC2 Instance

- Choose Ubuntu Server 20.04 LTS
- Instance type: t2.micro (free tier)
- Configure security group (allow ports 22, 80, 443, 3000)

### 2. Connect to Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### 3. Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

### 4. Clone and Setup

```bash
git clone https://github.com/TienxDun/TienxDun.github.io.git
cd TienxDun.github.io
npm install
```

### 5. Configure Environment

```bash
nano .env
```

Add your configuration and save.

### 6. Start with PM2

```bash
pm2 start server.js --name picture-game
pm2 save
pm2 startup
```

### 7. Configure Nginx (Optional)

```bash
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo systemctl restart nginx
```

## Deploying to Google Cloud Platform

### 1. Install Google Cloud SDK

```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init
```

### 2. Create app.yaml

```yaml
runtime: nodejs18

env_variables:
  NANA_BANANA_API_KEY: "your_api_key"
  NODE_ENV: "production"
```

### 3. Deploy

```bash
gcloud app deploy
```

## Environment Variables

Required environment variables for deployment:

- `NANA_BANANA_API_KEY` - Your Nana Banana API key (required)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## Post-Deployment

### 1. Verify Deployment

- Visit your deployed URL
- Test new game functionality
- Check hint system
- Test answer checking
- Verify new game button

### 2. Monitor Logs

Check application logs for errors:

```bash
# Heroku
heroku logs --tail

# Railway
Check dashboard logs

# Render
Check dashboard logs

# PM2 (EC2)
pm2 logs picture-game
```

### 3. Setup Custom Domain (Optional)

Configure DNS to point to your deployed application:
- Add A record pointing to your server IP
- Or CNAME record pointing to your platform's domain

### 4. Enable HTTPS

Most platforms (Heroku, Railway, Render) provide free SSL certificates automatically.

For custom servers:
```bash
# Using Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Troubleshooting

### Build Failures

- Check Node.js version compatibility
- Verify package.json is correct
- Ensure all dependencies are listed

### Runtime Errors

- Check environment variables are set
- Verify API key is valid
- Check application logs
- Ensure port is available

### Performance Issues

- Enable caching for images
- Use CDN for static files
- Increase server resources
- Implement rate limiting

## Scaling

### Horizontal Scaling

Most platforms support automatic scaling:
- Heroku: Add dynos
- Railway: Adjust instances
- Render: Enable auto-scaling
- AWS: Use load balancer

### Optimization

- Implement Redis caching for game states
- Use CDN for static assets
- Compress images
- Enable gzip compression
- Minify frontend assets

## Monitoring

### Recommended Tools

- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry, Rollbar
- **Performance**: New Relic, DataDog
- **Logs**: Papertrail, Loggly

### Health Check Endpoint

Add to `server.js`:

```javascript
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
```

## Backup and Recovery

### Database (if added later)

- Regular automated backups
- Test restore procedures
- Store backups offsite

### Code

- Always maintain git repository
- Tag releases
- Document deployment process

## Security Checklist

- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] API keys secured
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Regular dependency updates
- [ ] Security headers added
- [ ] Input validation enabled

## Support

For issues or questions:
- Check the README.md
- Review API_INTEGRATION.md
- Create a GitHub issue
- Check platform-specific documentation
