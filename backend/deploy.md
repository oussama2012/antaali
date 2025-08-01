# Backend Deployment Guide

## Deploy to Railway

### Step 1: Sign up for Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub or email
3. Verify your account

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo" 
3. Connect your GitHub account and select your repository
4. Choose the `backend` folder as the root directory

### Step 3: Add PostgreSQL Database
1. In your Railway project dashboard
2. Click "New Service" → "Database" → "PostgreSQL"
3. Railway will automatically create database and provide connection details

### Step 4: Set Environment Variables
In your Railway project settings, add these environment variables:

```
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
FRONTEND_URL=https://antaali-erp.windsurf.build
```

Railway will automatically provide these database variables:
- PGHOST
- PGPORT  
- PGDATABASE
- PGUSER
- PGPASSWORD

### Step 5: Deploy
1. Railway will automatically deploy your backend
2. You'll get a URL like: `https://your-app-name.railway.app`
3. Test the deployment by visiting: `https://your-app-name.railway.app/health`

### Step 6: Update Frontend
Once backend is deployed, update your frontend to use the new backend URL instead of localhost.

## Alternative: Deploy to Render

### Step 1: Sign up for Render
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repo
3. Select the backend folder
4. Configure:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: Node

### Step 3: Add PostgreSQL Database
1. Create new PostgreSQL database in Render
2. Copy connection details

### Step 4: Set Environment Variables
Add the same environment variables as Railway

## Testing Your Deployment

Once deployed, test these endpoints:
- `GET /health` - Should return 200 OK
- `POST /api/auth/login` - Test authentication
- `POST /api/orders` - Test order creation
- `GET /api/perfumes` - Test data retrieval

Your orders should now save properly!
