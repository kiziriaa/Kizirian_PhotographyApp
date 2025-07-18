# Kizirian Photography - Deployment Guide

## 🚀 Professional Hosting Setup ($26/month)

### Step 1: Deploy Frontend to Netlify Pro

1. **Go to Netlify**: Visit https://app.netlify.com/
2. **Sign up/Login**: Use your GitHub account for easy integration
3. **Import from Git**: 
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your `Kizirian_PhotographyApp` repository
   - Branch: `main`
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/dist`
4. **Deploy**: Click "Deploy site"
5. **Upgrade to Pro**: 
   - Go to Site settings → Plans and billing
   - Upgrade to Pro plan ($19/month)

### Step 2: Deploy Backend to Render

1. **Go to Render**: Visit https://render.com/
2. **Sign up/Login**: Use your GitHub account
3. **Create Web Service**:
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Environment Variables** (Add these in Render dashboard):
   ```
   NODE_ENV=production
   PORT=10000
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_REFRESH_TOKEN=your-google-refresh-token
   ```
5. **Upgrade to Starter**: Select Starter plan ($7/month)

### Step 3: Update API Endpoints

1. **Get your Render URL** (e.g., `https://your-app-name.onrender.com`)
2. **Update Netlify Configuration**:
   - Go to Netlify dashboard → Site settings → Environment variables
   - Add: `VITE_API_URL` = `https://your-backend-url.onrender.com`
3. **Update Frontend Code** (if needed):
   - Replace `http://localhost:5005` with `process.env.VITE_API_URL || 'http://localhost:5005'`

### Step 4: Configure Custom Domain (Optional)

1. **Buy Domain**: Purchase `kizirianphotography.com` (or similar)
2. **Add to Netlify**:
   - Go to Site settings → Domain management
   - Add custom domain
   - Follow DNS configuration instructions
3. **SSL Certificate**: Netlify provides free SSL automatically

## 🔧 Environment Variables Needed

### Backend (.env file):
```
NODE_ENV=production
PORT=10000
EMAIL_USER=kizirianphotography@gmail.com
EMAIL_PASS=your-gmail-app-password
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REFRESH_TOKEN=your-google-refresh-token
```

### Frontend (Netlify Environment Variables):
```
VITE_API_URL=https://your-backend-url.onrender.com
```

## 📝 Quick Deploy Steps

1. **Push code to GitHub** ✅ (Already done)
2. **Deploy to Netlify** (5 minutes setup)
3. **Deploy to Render** (10 minutes setup)
4. **Update API endpoints** (5 minutes)
5. **Test the live site** (Your girlfriend can test!)

## 💳 Monthly Costs

- **Netlify Pro**: $19/month
- **Render Starter**: $7/month
- **Total**: $26/month

## 🎯 Benefits

- ✅ Professional reliability (no downtime)
- ✅ Fast loading for image galleries
- ✅ Custom domain support
- ✅ SSL certificates included
- ✅ Analytics and monitoring
- ✅ Automatic deployments from GitHub
- ✅ Professional appearance for business

## 📞 Support

If you need help with any step, both Netlify and Render have excellent documentation and support teams.

## 🔄 Continuous Deployment

Once set up, any changes you push to GitHub will automatically deploy to both services!