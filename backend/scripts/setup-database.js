const { Client } = require('pg');
require('dotenv').config();

async function setupDatabase() {
  console.log('🔧 Setting up Antaali ERP Database...\n');

  // Parse DATABASE_URL or use individual variables
  let config;
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    config = {
      host: url.hostname,
      port: url.port || 5432,
      database: url.pathname.slice(1),
      user: url.username,
      password: url.password,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };
  } else {
    config = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'antaali_erp',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };
  }

  const client = new Client(config);

  try {
    await client.connect();
    console.log('✅ Connected to database successfully!');
    
    // Test the connection
    const result = await client.query('SELECT version()');
    console.log('📊 Database version:', result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1]);
    
    // Check if tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `);
    
    console.log('\n📋 Current tables in database:');
    if (tablesResult.rows.length === 0) {
      console.log('   No tables found - ready for migrations!');
    } else {
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    }
    
    console.log('\n🚀 Database is ready! You can now run migrations.');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n💡 Make sure to:');
    console.log('   1. Set your DATABASE_URL in .env file');
    console.log('   2. Or set individual DB_* variables');
    console.log('   3. Ensure your database is accessible');
  } finally {
    await client.end();
  }
}

setupDatabase();
