# 🚀 Antaali ERP Deployment Checklist

## ✅ Completed
- [x] Created migration files for all database tables
- [x] Set up Sequelize configuration
- [x] Installed Sequelize CLI
- [x] Created database setup scripts

## 🔄 Current Step: Database Setup

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose organization
4. Project name: `antaali-erp`
5. Database password: **Choose a strong password and SAVE IT!**
6. Region: Choose closest to your location
7. Click "Create new project"
8. Wait 2-3 minutes for setup to complete

### Step 2: Get Connection Details
1. In Supabase dashboard, go to **Settings** → **Database**
2. Scroll to **Connection string** section
3. Copy the **URI** (looks like this):
   ```
   postgresql://postgres:YOUR_PASSWORD@db.abcdefghijklmnop.supabase.co:5432/postgres
   ```
4. Note your project reference (the part after `db.` and before `.supabase.co`)

### Step 3: Update Environment File
1. Open `backend\.env.supabase`
2. Replace these placeholders with your actual values:
   - `[YOUR-PASSWORD]` → Your Supabase database password
   - `[PROJECT-REF]` → Your project reference from the connection string
3. Save the file as `backend\.env` (remove `.supabase` extension)

### Step 4: Test Connection
Run: `node scripts/setup-database.js`

## 📋 Next Steps (After Database Setup)
- [ ] Run database migrations
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Netlify
- [ ] Configure environment variables
- [ ] Test the deployed application

## 🔗 Important URLs to Save
- Supabase Project: `https://supabase.com/dashboard/project/[YOUR-PROJECT-REF]`
- Backend (Render): `https://your-app-name.onrender.com`
- Frontend (Netlify): `https://your-app-name.netlify.app`

## 🔑 Credentials to Keep Safe
- Supabase database password
- JWT secret key
- Supabase service role key (for admin operations)
