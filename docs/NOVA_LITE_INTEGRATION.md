# 🤖 Amazon Nova Lite AI Integration Guide

This guide covers the complete integration of Amazon Nova Lite AI model with HydroScribe water monitoring system.

## 📋 Overview

Amazon Nova Lite is a fast, efficient foundation model available through AWS Bedrock. It provides:

- **⚡ Fast Response Times**: Optimized for real-time applications
- **💰 Cost-Effective**: Lower cost per token compared to larger models
- **🌍 Multilingual Support**: Support for 200+ languages
- **🔒 Enterprise Security**: AWS-grade security and compliance
- **📊 Structured Output**: Reliable JSON and structured responses

## 🔧 Setup Instructions

### Step 1: AWS Account Setup

1. **Create AWS Account** (if you don't have one)
   - Go to [AWS Console](https://aws.amazon.com/console/)
   - Sign up for a new account or sign in

2. **Enable AWS Bedrock**
   - Navigate to AWS Bedrock in the console
   - Enable the service in your preferred region (us-east-1 recommended)

### Step 2: Request Nova Lite Model Access

1. **Go to Model Access Page**
   - In Bedrock console, click "Model access" in the sidebar
   - Find "Amazon Nova Lite" in the list

2. **Request Access**
   - Click "Request model access"
   - Fill out the form with your use case details:
     - **Use Case**: Water monitoring and management system
     - **Industry**: Agriculture/Environmental Monitoring
     - **Expected Volume**: Low to medium (for demo purposes)

3. **Wait for Approval**
   - Approval usually takes a few minutes to 24 hours
   - You'll receive an email notification when approved

### Step 3: Generate Access Keys

1. **Create IAM User** (Recommended)
   ```bash
   # Navigate to IAM in AWS Console
   # Create new user: "hydroscribe-nova-user"
   # Attach policy: AmazonBedrockFullAccess (or create custom policy)
   ```

2. **Custom Policy** (More Secure)
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Effect": "Allow",
               "Action": [
                   "bedrock:InvokeModel",
                   "bedrock:InvokeModelWithResponseStream"
               ],
               "Resource": "arn:aws:bedrock:*:*:foundation-model/amazon.nova-lite-v1:0"
           }
       ]
   }
   ```

3. **Generate Access Keys**
   - Go to Security credentials tab
   - Click "Create access key"
   - Choose "Application running outside AWS"
   - Save both Access Key ID and Secret Access Key

### Step 4: Configure Environment Variables

Create or update your `.env.local` file:

```bash
# AWS Configuration for Nova Lite
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...your_access_key_here
AWS_SECRET_ACCESS_KEY=wJalrXUtn...your_secret_key_here
```

### Step 5: Test Integration

1. **Start the Application**
   ```bash
   npm run dev
   ```

2. **Test Nova Lite**
   - Go to the dashboard
   - Select "🟠 Amazon Nova Lite" from the AI model dropdown
   - Click "Generate New Insights" to test
   - Try asking a question in the Q&A section

## 🔍 Model Specifications

| Feature | Specification |
|---------|---------------|
| **Model ID** | `amazon.nova-lite-v1:0` |
| **Max Tokens** | 300K input tokens |
| **Languages** | 200+ supported |
| **Response Format** | JSON, Text, Structured |
| **Latency** | Ultra-low (< 1s typical) |
| **Cost** | ~$0.0002/1K input tokens |

## 💡 Use Cases in HydroScribe

### 1. Water Level Analysis
```typescript
// Nova Lite analyzes sensor data for patterns
const insights = await novaLiteAI.generateWaterInsights(sensorData);
```

### 2. Risk Assessment
- Flood prediction based on historical patterns
- Drought warnings from sensor trends
- Equipment maintenance alerts

### 3. Interactive Q&A
```typescript
// Users can ask water management questions
const response = await novaLiteAI.generateQAResponse(
  "What should I do if water levels are consistently high?"
);
```

### 4. Real-time Recommendations
- Irrigation scheduling advice
- Water conservation strategies
- Emergency response protocols

## 🚨 Troubleshooting

### Common Issues

1. **"Access Denied" Error**
   ```
   Solution: Verify Nova Lite model access is approved in Bedrock console
   Check: IAM permissions are correctly configured
   ```

2. **"Model Not Found" Error**
   ```
   Solution: Ensure you're using the correct region (us-east-1)
   Check: Model ID is exactly "amazon.nova-lite-v1:0"
   ```

3. **Rate Limiting**
   ```
   Solution: Implement exponential backoff in requests
   Check: Your request frequency is within limits
   ```

4. **Invalid Credentials**
   ```
   Solution: Regenerate access keys in IAM console
   Check: Environment variables are correctly set
   ```

### Debug Commands

```bash
# Test AWS CLI connection
aws bedrock list-foundation-models --region us-east-1

# Test Nova Lite availability
aws bedrock get-foundation-model --model-identifier amazon.nova-lite-v1:0
```

## 📊 Monitoring Usage

### Cost Monitoring
1. Set up billing alerts in AWS Console
2. Monitor token usage in CloudWatch
3. Use AWS Cost Explorer for detailed analysis

### Performance Monitoring
```typescript
// Track response times and success rates
console.log('Nova Lite Response Time:', Date.now() - startTime);
console.log('Tokens Used:', response.usage.totalTokens);
```

## 🔒 Security Best Practices

1. **Never commit API keys to Git**
   ```bash
   # Add to .gitignore
   .env.local
   .env
   ```

2. **Use least privilege IAM policies**
   - Only grant Bedrock permissions needed
   - Restrict to specific model ARNs

3. **Rotate keys regularly**
   - Change access keys every 90 days
   - Delete unused keys immediately

4. **Monitor access patterns**
   - Enable CloudTrail logging
   - Set up unusual activity alerts

## 📈 Performance Optimization

### Request Optimization
```typescript
const optimizedRequest = {
  messages: [{ role: 'user', content: [{ text: shortPrompt }] }],
  inferenceConfig: {
    maxTokens: 500,    // Limit response length
    temperature: 0.7,   // Balance creativity vs consistency
    topP: 0.9          // Focus on high-probability tokens
  }
};
```

### Caching Strategy
```typescript
// Cache frequent responses to reduce API calls
const cacheKey = `nova-${question.slice(0, 50)}`;
const cachedResponse = cache.get(cacheKey);
if (cachedResponse) return cachedResponse;
```

## 🌟 Advanced Features

### Streaming Responses
```typescript
// Enable streaming for longer responses
const stream = await client.invokeModelWithResponseStream({
  modelId: 'amazon.nova-lite-v1:0',
  body: JSON.stringify(requestBody)
});
```

### Batch Processing
```typescript
// Process multiple sensor readings efficiently
const batchInsights = await Promise.all(
  sensorBatches.map(batch => novaLiteAI.generateWaterInsights(batch))
);
```

## 📞 Support

- **AWS Documentation**: [Amazon Bedrock Nova Lite](https://docs.aws.amazon.com/bedrock/latest/userguide/models-foundation-models.html)
- **HydroScribe Issues**: [GitHub Issues](https://github.com/your-repo/hydroscribe/issues)
- **AWS Support**: Available through AWS Console

---

🎉 **Congratulations!** Nova Lite is now integrated with your HydroScribe system, providing fast and efficient AI-powered water management insights!
