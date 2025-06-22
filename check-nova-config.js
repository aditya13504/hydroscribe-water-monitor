#!/usr/bin/env node

/**
 * Nova Lite Configuration Checker
 * Quick script to verify if Nova Lite is properly configured
 * 
 * Usage: node check-nova-config.js
 */

const fs = require('fs');
const path = require('path');

// Check if .env.local exists
const envLocalPath = path.join(__dirname, '.env.local');
const hasEnvLocal = fs.existsSync(envLocalPath);

console.log('🔍 Checking Nova Lite Configuration...\n');

if (hasEnvLocal) {
  console.log('✅ .env.local file found');
  require('dotenv').config({ path: '.env.local' });
} else {
  console.log('📄 .env.local file not found');
  console.log('💡 Create .env.local from .env.example to configure Nova Lite\n');
}

// Check environment variables
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION;

let configScore = 0;
let totalChecks = 3;

// Check AWS Access Key ID
if (AWS_ACCESS_KEY_ID) {
  console.log('✅ AWS_ACCESS_KEY_ID is set');
  configScore++;
} else {
  console.log('❌ AWS_ACCESS_KEY_ID is missing');
}

// Check AWS Secret Access Key
if (AWS_SECRET_ACCESS_KEY) {
  console.log('✅ AWS_SECRET_ACCESS_KEY is set');
  configScore++;
} else {
  console.log('❌ AWS_SECRET_ACCESS_KEY is missing');
}

// Check AWS Region
if (AWS_REGION) {
  console.log(`✅ AWS_REGION is set to: ${AWS_REGION}`);
  configScore++;
} else {
  console.log('⚠️  AWS_REGION is not set (will default to us-east-1)');
  configScore += 0.5; // Partial credit since it has a default
}

console.log('\n📊 Configuration Summary:');
console.log(`Score: ${configScore}/${totalChecks}`);

if (configScore === totalChecks) {
  console.log('🎉 Nova Lite is fully configured and ready to use!');
  console.log('\n🚀 Next steps:');
  console.log('1. Make sure you have requested Nova Lite model access in AWS Bedrock');
  console.log('2. Run: npm run dev');
  console.log('3. Go to dashboard and select "🟠 Amazon Nova Lite"');
  console.log('4. Test with: npm run test-nova');
} else if (configScore >= 2) {
  console.log('⚠️  Nova Lite is partially configured');
  console.log('\n🔧 To complete setup:');
  if (!hasEnvLocal) console.log('- Create .env.local file: cp .env.example .env.local');
  if (!AWS_ACCESS_KEY_ID) console.log('- Add AWS_ACCESS_KEY_ID to your .env.local file');
  if (!AWS_SECRET_ACCESS_KEY) console.log('- Add AWS_SECRET_ACCESS_KEY to your .env.local file');
  if (!AWS_REGION) console.log('- Add AWS_REGION to your .env.local file (recommended: us-east-1)');
} else {
  console.log('❌ Nova Lite is not configured');
  console.log('\n📝 Setup instructions:');
  if (!hasEnvLocal) {
    console.log('1. Create environment file:');
    console.log('   cp .env.example .env.local');
  } else {
    console.log('1. Edit your .env.local file');
  }
  console.log('2. Add your AWS credentials:');
  console.log('   AWS_ACCESS_KEY_ID=your_access_key_here');
  console.log('   AWS_SECRET_ACCESS_KEY=your_secret_key_here');
  console.log('   AWS_REGION=us-east-1');
  console.log('3. Follow the guide in docs/NOVA_LITE_INTEGRATION.md');
}

console.log('\n💡 Important: Nova Lite works with fallback insights even without AWS configuration!');
console.log('   - You can start using HydroScribe immediately: npm run dev');
console.log('   - Nova Lite will provide simulated insights until AWS is configured');
console.log('   - Mistral and Gemini AI work fully without any additional setup');
