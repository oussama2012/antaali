const { exec } = require('child_process');
const path = require('path');

// Set NODE_ENV if not already set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const environment = process.env.NODE_ENV;
console.log(`Running migrations for environment: ${environment}`);

// Run migrations
const command = 'npx sequelize-cli db:migrate';

exec(command, { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
  if (error) {
    console.error(`Migration error: ${error}`);
    process.exit(1);
  }
  
  if (stderr) {
    console.error(`Migration stderr: ${stderr}`);
  }
  
  console.log(`Migration stdout: ${stdout}`);
  console.log('✅ Database migrations completed successfully!');
});
