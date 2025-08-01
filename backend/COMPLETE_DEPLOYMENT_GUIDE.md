# 🚀 Complete Railway Deployment Guide for Antaali ERP Backend

## Step 1: Install Prerequisites

### Install Node.js and npm (if not already installed)
1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Install the LTS version (includes npm)
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Install Railway CLI
```bash
npm install -g @railway/cli
```

## Step 2: Prepare Your Backend

Your backend is already configured with:
- ✅ `package.json` with all dependencies
- ✅ `tsconfig.json` for TypeScript compilation
- ✅ `Dockerfile` for containerization
- ✅ `railway.toml` for Railway configuration
- ✅ `nixpacks.toml` for build configuration
- ✅ `.env.production` for production environment variables

## Step 3: Deploy to Railway

### 3.1 Login to Railway
```bash
railway login
```
This will open your browser to authenticate with Railway.

### 3.2 Initialize Railway Project
```bash
cd backend
railway init
```
Choose:
- Create a new project
- Name it "antaali-erp-backend"

### 3.3 Add PostgreSQL Database
```bash
railway add postgresql
```
This creates a PostgreSQL database instance for your project.

### 3.4 Set Environment Variables
```bash
# Generate and set JWT secret
railway variables set JWT_SECRET=$(openssl rand -base64 32)

# Set Node environment
railway variables set NODE_ENV=production

# Set your frontend URL for CORS (replace with your actual frontend URL)
railway variables set FRONTEND_URL=https://your-frontend-domain.com

# Optional: Set port (Railway sets this automatically)
railway variables set PORT=3001
```

### 3.5 Deploy Your Backend
```bash
railway up
```

This will:
1. Upload your code to Railway
2. Build your TypeScript project
3. Start your Express server
4. Provide you with a deployment URL

## Step 4: Post-Deployment Setup

### 4.1 Run Database Migrations
After deployment, initialize your database:
```bash
railway run npm run migrate
```

### 4.2 Create Initial Admin User
You can create an admin user by making a POST request to:
```
POST https://your-project.up.railway.app/api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@antaali.com",
  "password": "your-secure-password",
  "role": "admin"
}
```

## Step 5: Test Your Deployment

### Health Check
Visit: `https://your-project.up.railway.app/health`

Should return:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

### API Endpoints
Your backend provides these endpoints:

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

**Perfumes:**
- `GET /api/perfumes` - List all perfumes
- `POST /api/perfumes` - Create perfume (Admin only)
- `PUT /api/perfumes/:id` - Update perfume (Admin only)
- `DELETE /api/perfumes/:id` - Delete perfume (Admin only)

**Orders:**
- `GET /api/orders` - Get orders (filtered by user role)
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status (Admin only)

**Stores:**
- `GET /api/stores` - List stores
- `POST /api/stores` - Create store (Admin only)
- `PUT /api/stores/:id` - Update store (Admin only)

**Workers:**
- `GET /api/workers` - List workers
- `POST /api/workers` - Create worker (Admin only)
- `PUT /api/workers/:id` - Update worker (Admin only)

## Step 6: Connect Your Frontend

Update your frontend to use the Railway backend URL:

```typescript
// In your frontend config
const API_BASE_URL = 'https://your-project.up.railway.app/api';
```

## Troubleshooting

### Common Issues:

1. **Build Failures:**
   ```bash
   railway logs
   ```
   Check for TypeScript compilation errors.

2. **Database Connection Issues:**
   Ensure PostgreSQL service is running:
   ```bash
   railway status
   ```

3. **Environment Variables:**
   Check all variables are set:
   ```bash
   railway variables
   ```

4. **CORS Issues:**
   Make sure `FRONTEND_URL` is set correctly for your frontend domain.

### Useful Commands:
- `railway logs` - View application logs
- `railway status` - Check service status
- `railway variables` - List environment variables
- `railway open` - Open project in browser
- `railway domain` - Manage custom domains

## Security Notes

1. **JWT Secret:** Generated automatically with secure random string
2. **Database:** Automatically secured by Railway
3. **HTTPS:** Automatically provided by Railway
4. **Rate Limiting:** Built into the application
5. **Input Validation:** All endpoints have validation middleware

## Next Steps

1. ✅ Deploy backend to Railway
2. 🔄 Update frontend to use Railway backend URL
3. 🧪 Test all API endpoints
4. 📊 Set up monitoring and alerts
5. 🚀 Deploy frontend to production

Your Antaali ERP backend is now ready for production! 🎉
