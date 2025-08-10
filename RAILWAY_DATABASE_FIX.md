# Railway Database Connection Fix

## Problem
Railway automatically provisioned a PostgreSQL database, but your backend is configured for Supabase. This is causing the connection failure.

## Solution: Configure Railway to Use Supabase

### Step 1: Remove Railway's PostgreSQL Database
1. Go to your Railway project dashboard
2. Find the PostgreSQL service that was automatically created
3. Delete it (since you're using Supabase instead)

### Step 2: Add Supabase Environment Variables
In your Railway project dashboard, go to Variables and add:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key  
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=1220smoughen1220
```

### Step 3: Get Your Supabase Credentials
1. Go to your Supabase project: https://supabase.com/dashboard
2. Navigate to Settings > API
3. Copy these values:
   - **Project URL** → Use for `SUPABASE_URL`
   - **anon public** → Use for `SUPABASE_ANON_KEY`
   - **service_role** → Use for `SUPABASE_SERVICE_ROLE_KEY`

### Step 4: Verify Connection
Your backend uses Supabase client (not direct PostgreSQL), so the Railway PostgreSQL connection test won't work. Instead:

1. Check your Railway deployment logs
2. Look for "Supabase connection successful" message
3. Test your API endpoints through your frontend

## Alternative: Use Railway PostgreSQL Instead

If you prefer to use Railway's PostgreSQL database:

### Update Backend Configuration
You'll need to modify your backend to use Sequelize with PostgreSQL instead of Supabase:

1. **Environment Variables** (already configured in railway.toml):
```
PGHOST=yamabiko.proxy.rlwy.net
PGPORT=42943
PGDATABASE=railway
PGUSER=postgres
PGPASSWORD=KMwJctswUtyUtToZBqCOgMiCuYqtfDcJ
```

2. **Create Database Configuration File**:
```typescript
// src/config/database.ts
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT || '5432'),
  database: process.env.PGDATABASE,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export default sequelize;
```

3. **Update Your Models** to use Sequelize instead of Supabase

## Recommendation

**Stick with Supabase** since:
- Your frontend is already configured for it
- You have Transaction Pooler set up
- Your authentication system uses Supabase
- Less migration work required

Just remove Railway's PostgreSQL service and add the Supabase environment variables!
