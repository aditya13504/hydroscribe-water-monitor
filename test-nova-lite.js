#!/usr/bin/env node

/**
 * Nova Lite Integration Test Script
 * Run this script to test your Nova Lite AI integration
 * 
 * Usage: node test-nova-lite.js
 */

const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const fs = require('fs');
const path = require('path');

console.log('🧪 Nova Lite Integration Test\n');

// Check if .env.local exists
const envLocalPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envLocalPath)) {
  console.log('📄 .env.local file not found');
  console.log('💡 This is normal for first-time setup.\n');
}

// Try to load environment variables from .env.local
try {
  require('dotenv').config({ path: '.env.local' });
} catch (error) {
  // dotenv not installed, that's okay for this test
}

// Configuration
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const MODEL_ID = 'amazon.nova-lite-v1:0';

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  console.error('❌ Error: AWS credentials not found in environment variables');
  console.log('📝 This is expected if you haven\'t set up Nova Lite yet.\n');
  console.log('🔧 To set up Nova Lite with full AWS functionality:');
  console.log('1. Copy .env.example to .env.local');
  console.log('2. Add your AWS credentials to .env.local:');
  console.log('   AWS_ACCESS_KEY_ID=your_access_key_here');
  console.log('   AWS_SECRET_ACCESS_KEY=your_secret_key_here');
  console.log('   AWS_REGION=us-east-1');
  console.log('3. Follow the guide in docs/NOVA_LITE_INTEGRATION.md\n');
  console.log('💡 Note: Nova Lite works with fallback insights even without AWS setup!');
  console.log('   You can still use Nova Lite in the dashboard - it will provide simulated insights.');
  console.log('\n🚀 To use HydroScribe right now: npm run dev');  process.exit(0);  // Exit gracefully, not as an error
}

async function testNovaLite() {
  console.log('🧪 Testing Amazon Nova Lite Integration...\n');
  
  const testRequest = {
    messages: [{
      role: 'user',
      content: [{
        text: 'Hello! Can you help analyze water sensor data for a monitoring system?'
      }]
    }],
    inferenceConfig: {
      maxTokens: 200,
      temperature: 0.7
    }
  };

  try {
    // Create Bedrock Runtime client
    const client = new BedrockRuntimeClient({ 
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
      }
    });
    
    // Create the invoke model command
    const command = new InvokeModelCommand({
      modelId: MODEL_ID,
      body: JSON.stringify(testRequest),
      contentType: "application/json"
    });

    console.log('📡 Sending request to Nova Lite...');
    const response = await client.send(command);
    
    // Parse the response
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    console.log('✅ Nova Lite Integration Test: SUCCESS');
    console.log('📊 Response Preview:');
    console.log('   Message:', responseBody.output?.message?.content?.[0]?.text?.substring(0, 100) + '...');
    console.log('   Tokens Used:', responseBody.usage?.totalTokens || 'N/A');
    console.log('   Model:', MODEL_ID);
    console.log('\n🎉 Nova Lite is ready for HydroScribe!');
    
  } catch (error) {
    console.log('❌ Nova Lite Integration Test: FAILED');
    console.log('   Error:', error.message);
    
    if (error.name === 'ValidationException') {
      console.log('\n💡 Troubleshooting:');
      console.log('   1. Check if Nova Lite model access is approved in AWS Bedrock console');
      console.log('   2. Verify the model ID is correct: amazon.nova-lite-v1:0');
      console.log('   3. Ensure you\'re using the correct AWS region');
    } else if (error.name === 'UnauthorizedOperation' || error.name === 'AccessDeniedException') {
      console.log('\n💡 Troubleshooting:');
      console.log('   1. Verify IAM permissions for Bedrock operations');
      console.log('   2. Check if your AWS credentials are correct');
      console.log('   3. Ensure you have bedrock:InvokeModel permission');
    } else {
      console.log('\n💡 Troubleshooting:');
      console.log('   1. Check your AWS credentials');
      console.log('   2. Verify network connectivity');
      console.log('   3. Ensure AWS region is correct');
    }
  }
}

// Run the test
testNovaLite().catch(console.error);
