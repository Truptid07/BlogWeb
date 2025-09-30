# Render Deployment Guide for BlogWeb

This guide will help you deploy your MERN stack blog website to Render.

## Prerequisites

1. **GitHub Repository**: Your code should be pushed to GitHub (✅ Already done)
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Cloudinary Account**: For image uploads (✅ Already configured)

## Deployment Steps

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Connect your GitHub repository

### Step 2: Deploy Backend API

1. **Create Web Service**:
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repo: `Truptid07/BlogWeb`
   - Configure the service:
     - **Name**: `blogweb-backend`
     - **Environment**: `Node`
     - **Build Command**: `cd backend && npm install`
     - **Start Command**: `cd backend && npm start`
     - **Plan**: Free

2. **Set Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=8f2a9c4d6b1e3f7a5c9d2e8f4a6b9c1d3e7f2a5c8d1e4f7a2c5d8e1f4a7b9c2e5f8a1d4e7f2a5c8d1e4f7a2c
   CLOUDINARY_CLOUD_NAME=blog
   CLOUDINARY_API_KEY=761868572134681
   CLOUDINARY_API_SECRET=TxShcWM1Xhq7GvZHKiwVWtQLcEM
   ```

### Step 3: Create MongoDB Database

1. **Create Database**:
   - In Render Dashboard, click "New +" → "PostgreSQL" → "MongoDB"
   - **Name**: `blogweb-mongodb`
   - **Database Name**: `blogplatform`
   - **Plan**: Free

2. **Get Connection String**:
   - Copy the Internal Connection String
   - Add it to your backend environment variables as `MONGODB_URI`

### Step 4: Deploy Frontend

1. **Create Static Site**:
   - Click "New +" → "Static Site"
   - Connect the same GitHub repo
   - Configure:
     - **Name**: `blogweb-frontend`
     - **Build Command**: `cd frontend && npm install && npm run build`
     - **Publish Directory**: `frontend/build`

2. **Set Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend-service.onrender.com/api
   ```

### Step 5: Update CORS Settings

After getting your frontend URL, update the backend CORS settings to include your frontend domain.

### Step 6: Seed Database

1. SSH into your backend service or use a one-time script
2. Run the seed command to create the admin user and sample data

## Important Notes

- **Free Tier Limitations**: Services may sleep after inactivity
- **Cold Starts**: First request after sleep may take 30+ seconds
- **Database**: MongoDB free tier has storage limits
- **SSL**: All Render services come with free SSL certificates

## Admin Access After Deployment

- **Email**: admin@example.com
- **Password**: admin123

## Troubleshooting

1. **Service Won't Start**: Check logs in Render dashboard
2. **Database Connection Issues**: Verify MongoDB connection string
3. **CORS Errors**: Ensure frontend URL is allowed in backend CORS settings
4. **Build Failures**: Check package.json scripts and dependencies

## URLs After Deployment

- **Backend API**: `https://blogweb-backend.onrender.com`
- **Frontend**: `https://blogweb-frontend.onrender.com`
- **Health Check**: `https://blogweb-backend.onrender.com/api/health`

## Cost Estimation

- **Backend Web Service**: Free (sleeps after inactivity)
- **Frontend Static Site**: Free
- **MongoDB Database**: Free (500MB storage)
- **Total Monthly Cost**: $0 (Free tier)

For production use, consider upgrading to paid plans for better performance and no sleeping.