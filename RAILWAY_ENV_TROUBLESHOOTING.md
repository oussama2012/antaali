# Railway Environment Variables Troubleshooting Guide

## Issue: Environment Variables Not Accessible in Railway Deployment

### Root Cause
Railway environment variables weren't properly configured for Supabase database connection, and the configuration was set up for Railway's built-in PostgreSQL instead.

### Solution Steps

## Step 1: Update Railway Environment Variables

In your Railway project dashboard, go to **Variables** tab and set these **exact** environment variables:

```bash
# Database Configuration
DATABASE_URL=postgresql://postgres.gbsgktjidvwrfzkvtwpk:TRHvcgsbgtThkg1s@aws-0-eu-west-3.pooler.supabase.com:6543/postgres

# Supabase Configuration
SUPABASE_URL=https://gbsgktjidvwrfzkvtwpk.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdic2drdGppZHZ3cmZ6a3Z0d3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDA4NjksImV4cCI6MjA2OTk3Njg2OX0.15lN1wuOKwFCi3SXe2LBTRuMPGj0SaPXAoQjwi8hvSg
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdic2drdGppZHZ3cmZ6a3Z0d3BrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQwMDg2OSwiZXhwIjoyMDY5OTc2ODY5fQ.zELitWpfROvvgMlASQWCUYQ8VD6mL_Kox-tS_8f9fuc

# Application Configuration
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://antaali.netlify.app
JWT_SECRET=1220smoughen1220
```

## Step 2: Verify Variable Names

**CRITICAL**: Ensure variable names match exactly what your code expects:
- `DATABASE_URL` (not `SUPABASE_DATABASE_URL`)
- `SUPABASE_URL` (not `SUPABASE_PROJECT_URL`)
- `SUPABASE_ANON_KEY` (not `SUPABASE_KEY`)
- `SUPABASE_SERVICE_ROLE_KEY` (not `SUPABASE_SERVICE_KEY`)

## Step 3: Force Redeploy

After setting variables:
1. Go to **Deployments** tab in Railway dashboard
2. Click **Redeploy** on the latest deployment
3. Or push a small change to trigger automatic redeploy

## Step 4: Verify Environment Variables Are Loading

Add this temporary debug endpoint to your server.ts:

```typescript
// Debug endpoint - REMOVE in production
app.get('/debug/env', (req, res) => {
  res.json({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    FRONTEND_URL: process.env.FRONTEND_URL,
    DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
    SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET'
  });
});
```

## Step 5: Check Railway Logs

1. Go to Railway dashboard → **Deployments**
2. Click on latest deployment
3. Check **Build Logs** and **Deploy Logs**
4. Look for any environment variable related errors

## Common Issues & Solutions

### Issue 1: Variables Show as "undefined"
**Solution**: Check variable names are exactly as expected in code (case-sensitive)

### Issue 2: Variables Not Updating After Changes
**Solution**: Force redeploy after changing variables

### Issue 3: Local .env Overriding Production
**Solution**: Ensure `.env` files are in `.gitignore` and not deployed

### Issue 4: Railway Using Built-in PostgreSQL
**Solution**: Remove any Railway PostgreSQL service from your project

## Verification Checklist

- [ ] All environment variables set in Railway dashboard
- [ ] Variable names match exactly what code expects
- [ ] Forced redeploy after setting variables
- [ ] No .env files committed to repository
- [ ] Railway logs show successful deployment
- [ ] /health endpoint returns 200 OK
- [ ] /debug/env endpoint shows all variables as "SET"

## Next Steps After Fix

1. Test your API endpoints
2. Verify database connection works
3. Remove the debug endpoint
4. Update frontend to use Railway backend URL
5. Test full application flow

## Railway Backend URL
Your Railway backend will be available at: `https://[your-project-name].railway.app`

Update your frontend environment variables to use this URL for API calls.
