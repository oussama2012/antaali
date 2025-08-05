# Antaali ERP Deployment Guide

## Overview
This guide covers deploying the Antaali ERP system with:
- **Frontend**: Netlify
- **Backend**: Render
- **Database**: Supabase
- **Security**: Enhanced security features

## Prerequisites
- GitHub account
- Netlify account
- Render account
- Supabase account

## 1. Database Setup (Supabase)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Choose a database password
4. Wait for setup to complete

### Step 2: Configure Database
1. Go to SQL Editor in Supabase dashboard
2. Run the migration scripts from `backend/migrations/`
3. Enable Row Level Security (RLS) for all tables
4. Set up authentication policies

### Step 3: Get Connection Details
From Settings > Database, note:
- `SUPABASE_URL`: Your project URL
- `SUPABASE_ANON_KEY`: Your anon public key
- `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (keep secret!)

## 2. Backend Deployment (Render)

### Step 1: Prepare Repository
1. Push your code to GitHub
2. Ensure `render.yaml` is in the backend directory

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com)
2. Connect your GitHub account
3. Create new "Web Service"
4. Select your repository
5. Set root directory to `backend`
6. Use these settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: 18

### Step 3: Environment Variables
Set these in Render dashboard:
```
NODE_ENV=production
JWT_SECRET=<generate-strong-secret>
JWT_EXPIRES_IN=24h
SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-key>
FRONTEND_URL=<your-netlify-url>
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 3. Frontend Deployment (Netlify)

### Step 1: Build Configuration
The `netlify.toml` is already configured. Ensure these settings:
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
```

### Step 2: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Connect your GitHub account
3. Select your repository
4. Set build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Deploy site

### Step 3: Environment Variables
Set in Netlify dashboard:
```
VITE_API_URL=<your-render-backend-url>
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

## 4. Security Features Implemented

### Backend Security
- **Helmet**: Security headers protection
- **Rate Limiting**: Multiple tiers (auth, API, uploads)
- **Request Sanitization**: XSS and injection protection
- **IP Whitelisting**: For admin endpoints
- **Security Logging**: Comprehensive audit trail
- **JWT Authentication**: Secure token-based auth
- **CORS Configuration**: Restricted origins
- **Input Validation**: Joi schema validation

### Database Security
- **Row Level Security (RLS)**: Enabled on all tables
- **Connection Encryption**: SSL/TLS enforced
- **Service Role Separation**: Different keys for different access levels

### Infrastructure Security
- **Non-root Docker User**: Container runs as non-privileged user
- **Health Checks**: Automated monitoring
- **Environment Isolation**: Separate configs for dev/prod

## 5. Post-Deployment Steps

### Verify Deployments
1. Test frontend at your Netlify URL
2. Test backend health check: `<render-url>/health`
3. Verify database connectivity

### Configure CORS
Update backend CORS settings with your actual frontend URL:
```typescript
app.use(cors({
  origin: 'https://your-netlify-site.netlify.app',
  credentials: true
}));
```

### Set up Monitoring
1. Enable Render metrics
2. Configure Supabase monitoring
3. Set up log aggregation

## 6. Security Checklist

- [ ] All environment variables set securely
- [ ] HTTPS enforced on all services
- [ ] Database RLS policies configured
- [ ] Rate limiting tested
- [ ] Authentication flows verified
- [ ] File upload restrictions tested
- [ ] CORS properly configured
- [ ] Security headers validated
- [ ] Audit logging enabled

## 7. Troubleshooting

### Common Issues
1. **CORS errors**: Check frontend URL in backend CORS config
2. **Database connection**: Verify Supabase credentials
3. **Build failures**: Check Node.js version compatibility
4. **Rate limiting**: Adjust limits based on usage patterns

### Logs
- **Render**: Check service logs in dashboard
- **Netlify**: Check function logs and build logs
- **Supabase**: Check database logs in dashboard

## 8. Maintenance

### Regular Tasks
- Monitor security logs for suspicious activity
- Update dependencies monthly
- Review and rotate JWT secrets quarterly
- Backup database regularly
- Monitor rate limiting effectiveness

### Scaling Considerations
- Upgrade Render plan for higher traffic
- Implement Redis for session management
- Consider CDN for static assets
- Database connection pooling for high concurrency
