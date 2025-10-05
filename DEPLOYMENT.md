# Deployment Guide - CSV to NetSuite Journal Converter

This guide covers multiple deployment options for your application, from simple cloud platforms to containerized solutions.

## 🚀 Deployment Options

### Option 1: Heroku (Recommended for beginners)
- **Pros**: Easy setup, free tier available, automatic deployments
- **Cons**: Limited free tier resources
- **Best for**: Quick deployment and testing

### Option 2: Vercel + Railway/Render
- **Pros**: Excellent performance, modern deployment pipeline
- **Cons**: Requires splitting frontend/backend
- **Best for**: Production applications

### Option 3: Docker + Cloud Platform
- **Pros**: Consistent across environments, scalable
- **Cons**: More complex setup
- **Best for**: Enterprise or complex deployments

---

## 🎯 Option 1: Heroku Deployment (Easiest)

### Prerequisites
- Heroku account (free at heroku.com)
- Heroku CLI installed

### Steps

1. **Install Heroku CLI** (if not already installed):
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Or download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**:
   ```bash
   heroku login
   ```

3. **Create Heroku app**:
   ```bash
   heroku create your-app-name-here
   ```

4. **Set buildpacks** (Heroku needs to know how to build both frontend and backend):
   ```bash
   heroku buildpacks:add heroku/nodejs
   heroku buildpacks:add https://github.com/mars/create-react-app-buildpack.git
   ```

5. **Deploy**:
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push heroku main
   ```

6. **Open your app**:
   ```bash
   heroku open
   ```

---

## 🎯 Option 2: Vercel + Railway (Modern Stack)

### Frontend (Vercel)

1. **Push to GitHub** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `client`
   - Deploy

3. **Update API URL** in client:
   - The backend will be on Railway, update the API calls

### Backend (Railway)

1. **Go to [railway.app](https://railway.app)**
2. **Connect GitHub repository**
3. **Select server folder as root**
4. **Deploy**

---

## 🎯 Option 3: Docker Deployment

### Docker Setup

1. **Build and run locally**:
   ```bash
   docker-compose up --build
   ```

2. **Deploy to any cloud platform**:
   - AWS ECS
   - Google Cloud Run
   - Azure Container Instances
   - DigitalOcean App Platform

---

## 🔧 Production Configuration

### Environment Variables

Create these environment variables in your deployment platform:

```
NODE_ENV=production
PORT=5000
```

### Security Considerations

- Add CORS configuration for production domains
- Implement file size limits
- Add rate limiting
- Consider adding authentication if needed

---

## 📊 Monitoring & Maintenance

### Health Checks
- The app includes a health endpoint: `/api/health`
- Monitor this endpoint for uptime

### Logs
- Heroku: `heroku logs --tail`
- Vercel: Dashboard logs
- Railway: Dashboard logs

### Scaling
- Heroku: Upgrade dyno type
- Vercel: Automatic scaling
- Railway: Automatic scaling

---

## 🆘 Troubleshooting

### Common Issues

1. **Build failures**:
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json

2. **CORS errors**:
   - Update CORS configuration for production domain
   - Check frontend API URL configuration

3. **File upload issues**:
   - Check file size limits
   - Verify multer configuration

4. **Memory issues**:
   - Large CSV files may cause memory issues
   - Consider streaming for large files

---

## 💰 Cost Comparison

| Platform | Free Tier | Paid Plans |
|----------|-----------|------------|
| Heroku | 550-1000 dyno hours/month | $7-25/month |
| Vercel | 100GB bandwidth/month | $20/month |
| Railway | $5 credit/month | $5+/month |
| DigitalOcean | - | $5/month |

---

## 🎉 Quick Start (Heroku)

If you want to deploy quickly to Heroku:

```bash
# 1. Install Heroku CLI and login
heroku login

# 2. Create app
heroku create your-csv-netsuite-app

# 3. Set buildpacks
heroku buildpacks:add heroku/nodejs
heroku buildpacks:add https://github.com/mars/create-react-app-buildpack.git

# 4. Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# 5. Open
heroku open
```

Your app will be live at: `https://your-csv-netsuite-app.herokuapp.com`
