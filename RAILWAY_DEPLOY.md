# 🚂 Deploy Antaali ERP Backend to Railway

## 🎯 Your Current Setup
- ✅ **Frontend**: https://antaali.netlify.app (already deployed!)
- ✅ **Database**: Supabase with Transaction Pooler (already configured!)
- 🚀 **Backend**: Railway (let's deploy this now!)

## 🚀 Railway Deployment (5 minutes)

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Sign in with **GitHub** (no credit card required!)
4. You'll get **$5 free credits** monthly

### Step 2: Deploy Your Backend
1. Click **"Deploy from GitHub repo"**
2. Select your **`antaali`** repository
3. Railway will detect your Node.js app automatically
4. Click **"Deploy Now"**

### Step 3: Add Environment Variables
In your Railway dashboard, go to **Variables** tab and add these:

#### Basic Configuration:
```
NODE_ENV=production
JWT_SECRET=antaali-super-secret-jwt-key-2024-production-secure
JWT_EXPIRES_IN=24h
FRONTEND_URL=https://antaali.netlify.app
```

#### Supabase Database Configuration:
```
DATABASE_URL=[Your Supabase Transaction Pooler URL]
SUPABASE_URL=[Your Supabase Project URL]
SUPABASE_ANON_KEY=[Your Supabase Anon Key]
SUPABASE_SERVICE_ROLE_KEY=[Your Supabase Service Role Key]
DB_DIALECT=postgres
```

#### App Settings:
```
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 4: Get Your Supabase Credentials

#### From Supabase Dashboard:
1. **Settings** → **Database**
   - Copy **Transaction Pooler URL** (mode: Transaction)
2. **Settings** → **API**
   - Copy **Project URL**
   - Copy **Anon Key**
   - Copy **Service Role Key** (keep this secret!)

### Step 5: Deploy!
1. After adding all environment variables
2. Railway will automatically redeploy
3. Your backend will be live at: `https://your-app-name.up.railway.app`

## 🔗 Connect Frontend to Backend

### Update Netlify Environment Variables:
1. Go to **Netlify Dashboard**
2. Find your **antaali** site
3. Go to **Site Settings** → **Environment Variables**
4. Add this variable:
   ```
   Name: VITE_API_URL
   Value: https://your-railway-backend-url.up.railway.app
   ```
5. **Redeploy** your Netlify site

## ✅ Final Architecture

After deployment, your complete system will be:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (Netlify)     │───▶│   (Railway)     │───▶│   (Supabase)    │
│ antaali.netlify │    │ your-app.up.    │    │ Transaction     │
│ .app            │    │ railway.app     │    │ Pooler          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎉 What You'll Have

Your complete Antaali ERP system with:
- ✅ **Responsive Design** - Works on mobile, tablet, desktop
- ✅ **User Management** - Store managers get automatic credentials
- ✅ **Inventory System** - Orders automatically deduct from stock
- ✅ **Secure Authentication** - No hardcoded test accounts
- ✅ **Production Database** - Supabase with Transaction Pooler
- ✅ **Free Hosting** - No credit card required!

## 🆘 Need Help?

If you run into any issues during deployment, just let me know and I'll help you troubleshoot!

---
**Your Antaali ERP System - Ready for Production!** 🚀
