const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting ELORA Server...\n');

// Check if MongoDB is running
console.log('📋 Pre-flight checks:');
console.log('1. Make sure MongoDB is running on localhost:27017');
console.log('2. Check .env file configuration');
console.log('3. Ensure all dependencies are installed\n');

// Start the server
const serverProcess = spawn('node', ['server.js'], {
  cwd: __dirname,
  stdio: 'inherit'
});

serverProcess.on('error', (error) => {
  console.error('❌ Failed to start server:', error.message);
});

serverProcess.on('close', (code) => {
  console.log(`\n🔴 Server process exited with code ${code}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  serverProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  serverProcess.kill('SIGTERM');
  process.exit(0);
});