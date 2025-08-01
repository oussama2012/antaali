# Antaali ERP Backend - Railway Deployment Guide

## Prerequisites

1. **Railway CLI**: Install the Railway CLI
   ```bash
   npm install -g @railway/cli
   ```

2. **Railway Account**: Create an account at [railway.app](https://railway.app)

## Deployment Steps

### 1. Login to Railway
```bash
railway login
```

### 2. Initialize Railway Project
```bash
cd backend
railway init
```

### 3. Add PostgreSQL Database
```bash
railway add postgresql
```

### 4. Set Environment Variables
```bash
# JWT Secret (generate a secure random key)
railway variables set JWT_SECRET=$(openssl rand -base64 32)

# Node Environment
railway variables set NODE_ENV=production

# Port (Railway will set this automatically, but we can specify)
railway variables set PORT=3001

# CORS Frontend URL (update with your frontend URL)
railway variables set FRONTEND_URL=https://your-frontend-domain.com
```

### 5. Deploy
```bash
railway up
```

## Environment Variables Needed

Railway will automatically provide these database variables:
- `PGHOST` - Database host
- `PGPORT` - Database port  
- `PGDATABASE` - Database name
- `PGUSER` - Database user
- `PGPASSWORD` - Database password

You need to manually set:
- `JWT_SECRET` - JWT signing secret
- `NODE_ENV` - Set to "production"
- `FRONTEND_URL` - Your frontend domain for CORS

## Database Migration

After deployment, run migrations:
```bash
railway run npm run migrate
```

## Monitoring

- **Logs**: `railway logs`
- **Status**: `railway status`
- **Variables**: `railway variables`

## Troubleshooting

1. **Build Failures**: Check `railway logs` for TypeScript compilation errors
2. **Database Connection**: Ensure PostgreSQL service is running
3. **Environment Variables**: Verify all required variables are set with `railway variables`

## Health Check

Your backend will be available at: `https://your-project-name.up.railway.app`

Health check endpoint: `https://your-project-name.up.railway.app/health`

## API Endpoints

Once deployed, your API will be available at:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `GET /api/perfumes` - Get perfumes
- `POST /api/perfumes` - Create perfume (Admin only)
- `GET /api/orders` - Get orders
- `POST /api/orders` - Create order
- And more...

## Next Steps

1. Update your frontend to use the Railway backend URL
2. Test all API endpoints
3. Set up database migrations and seeders
4. Configure monitoring and alerts
