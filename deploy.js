const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Antaali ERP Deployment Helper\n');

// Check if we're in the right directory
if (!fs.existsSync('backend') || !fs.existsSync('src')) {
  console.error('❌ Please run this script from the project root directory');
  process.exit(1);
}

// Check if backend .env exists
const envPath = path.join('backend', '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ Backend .env file not found!');
  console.log('💡 Please create backend/.env with your Supabase credentials');
  console.log('   Use backend/.env.supabase as a template');
  process.exit(1);
}

console.log('✅ Environment file found');

// Check if git repo is initialized
try {
  execSync('git status', { stdio: 'ignore' });
  console.log('✅ Git repository detected');
} catch {
  console.log('⚠️  No git repository found. Initializing...');
  execSync('git init');
  execSync('git add .');
  execSync('git commit -m "Initial commit - Antaali ERP"');
  console.log('✅ Git repository initialized');
}

// Check for uncommitted changes
try {
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  if (status.trim()) {
    console.log('📝 Uncommitted changes detected. Committing...');
    execSync('git add .');
    execSync('git commit -m "Update for deployment"');
    console.log('✅ Changes committed');
  }
} catch (error) {
  console.log('⚠️  Could not check git status');
}

console.log('\n🎯 Deployment Checklist:');
console.log('1. ✅ Project structure verified');
console.log('2. ✅ Environment file exists');
console.log('3. ✅ Git repository ready');
console.log('4. ⏳ Database setup (manual step required)');
console.log('5. ⏳ Backend deployment to Render');
console.log('6. ⏳ Frontend deployment to Netlify');

console.log('\n📋 Next Steps:');
console.log('1. Complete Supabase setup with your credentials');
console.log('2. Test database connection: cd backend && node scripts/setup-database.js');
console.log('3. Run migrations: cd backend && npm run migrate');
console.log('4. Push to GitHub (if not already done)');
console.log('5. Deploy backend to Render');
console.log('6. Deploy frontend to Netlify');

console.log('\n🔗 Quick Commands:');
console.log('Test DB:     cd backend && node scripts/setup-database.js');
console.log('Migrate:     cd backend && npm run migrate');
console.log('Dev Backend: cd backend && npm run dev');
console.log('Dev Frontend: npm run dev');

console.log('\n✨ Ready for deployment!');
