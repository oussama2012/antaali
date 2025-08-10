# Railway Deployment Guide for Antaali ERP Backend

## Prerequisites
- Railway account (sign up at [railway.app](https://railway.app))
- GitHub repository with your backend code
- Supabase project with Transaction Pooler configured

## Step 1: Prepare Your Repository

Ensure your repository has the following files (already configured):
- ✅ `railway.toml` - Railway deployment configuration
- ✅ `nixpacks.toml` - Build configuration for Node.js
- ✅ `.env.production` - Environment variables template
- ✅ `package.json` - Dependencies and scripts

## Step 2: Deploy to Railway

### Option A: Deploy via Railway Dashboard
1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will automatically detect the configuration and start building

### Option B: Deploy via Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project in your backend directory
cd backend
railway init

# Deploy
railway up
```

## Step 3: Configure Environment Variables

In your Railway project dashboard, add these environment variables:

### Required Supabase Variables
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### JWT Configuration
```
JWT_SECRET=your_secure_jwt_secret_key
```

### Other Variables (already configured in railway.toml)
- `NODE_ENV=production`
- `PORT=3001`
- `FRONTEND_URL=https://antaali.netlify.app`

## Step 4: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the following:
   - **Project URL** → `SUPABASE_URL`
   - **anon/public key** → `SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## Step 5: Update Frontend Configuration

Once deployed, Railway will provide you with a deployment URL (e.g., `https://your-app.railway.app`).

Update your frontend environment variables:
```
VITE_API_URL=https://your-app.railway.app
```

## Step 6: Test the Deployment

1. Check Railway logs for any deployment issues
2. Test the health endpoint: `https://your-app.railway.app/health`
3. Verify database connection through your frontend
4. Test authentication and API endpoints

## Railway Configuration Details

### Health Check
- Path: `/health`
- Timeout: 100 seconds
- Restart policy: ON_FAILURE (max 10 retries)

### Build Process
- Uses Nixpacks with Node.js 18
- Runs `npm ci` for clean install
- Builds with `npm run build`
- Starts with `npm start`

## Troubleshooting

### Common Issues:
1. **Build failures**: Check that all dependencies are in `package.json`
2. **Environment variables**: Ensure all required variables are set in Railway dashboard
3. **Database connection**: Verify Supabase credentials and connection pooler settings
4. **CORS errors**: Confirm `FRONTEND_URL` matches your Netlify deployment

### Useful Railway Commands:
```bash
railway logs          # View deployment logs
railway status        # Check service status
railway shell         # Access deployment shell
railway variables     # Manage environment variables
```

## Security Notes

- ✅ Security middleware already configured (helmet, rate limiting, CORS)
- ✅ JWT authentication implemented
- ✅ Input validation with Joi schemas
- ✅ Request sanitization for XSS protection

## Next Steps

After successful deployment:
1. Update your frontend to use the new Railway backend URL
2. Test all functionality end-to-end
3. Monitor Railway logs for any issues
4. Consider setting up custom domain if needed

---

**Need Help?**
- Railway Documentation: https://docs.railway.app
- Supabase Documentation: https://supabase.com/docs
- Check Railway logs for detailed error messages
