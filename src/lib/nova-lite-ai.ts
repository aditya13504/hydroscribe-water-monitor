import { WaterSensorData, AIInsight, NovaLiteAIRequest } from '@/types';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

interface NovaLiteResponse {
  output: {
    message: {
      role: string;
      content: Array<{
        text: string;
      }>;
    };
  };
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
}

export class NovaLiteAIService {
  private apiKey: string;
  private secretKey: string;
  private region: string;
  private modelId = 'amazon.nova-lite-v1:0';
  private isConfigured: boolean;
  private client: BedrockRuntimeClient | null = null;

  constructor() {
    this.apiKey = process.env.AWS_ACCESS_KEY_ID || '';
    this.secretKey = process.env.AWS_SECRET_ACCESS_KEY || '';
    this.region = process.env.AWS_REGION || 'us-east-1';
    
    // Check if credentials are configured
    this.isConfigured = !!(this.apiKey && this.secretKey);
    
    if (this.isConfigured) {
      this.client = new BedrockRuntimeClient({
        region: this.region,
        credentials: {
          accessKeyId: this.apiKey,
          secretAccessKey: this.secretKey
        }
      });
    } else {
      console.warn('Nova Lite: AWS credentials not configured. Service will use fallback mode.');
    }  }

  async generateWaterInsights(sensorData: WaterSensorData[]): Promise<AIInsight[]> {
    // If credentials not configured, return fallback insights immediately
    if (!this.isConfigured || !this.client) {
      console.log('Nova Lite: Using fallback insights (AWS credentials not configured)');
      return this.generateFallbackInsights(sensorData);
    }

    try {
      const prompt = this.createWaterAnalysisPrompt(sensorData);
      
      const requestBody: NovaLiteAIRequest = {
        messages: [
          {
            role: 'user',
            content: [{ text: prompt }]
          }
        ],
        inferenceConfig: {
          maxTokens: 1000,
          temperature: 0.7,
          topP: 0.9        }
      };

      // Use AWS SDK to invoke the model
      const command = new InvokeModelCommand({
        modelId: this.modelId,
        body: JSON.stringify(requestBody),
        contentType: "application/json"
      });      const response = await this.client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body)) as NovaLiteResponse;
      
      if (!responseBody.output?.message?.content?.[0]?.text) {
        throw new Error('Invalid response format from Nova Lite');
      }

      return this.parseInsights(responseBody.output.message.content[0].text);
    } catch (error) {
      console.error('Error calling Nova Lite API:', error);
      // Return fallback insights
      return this.generateFallbackInsights(sensorData);
    }
  }  async generateQAResponse(question: string): Promise<string> {
    // If credentials not configured, return a helpful message
    if (!this.isConfigured || !this.client) {
      return 'Nova Lite AI is currently not configured with AWS credentials. Please set up your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables to use Nova Lite. For now, you can try using Mistral or Gemini AI models.';
    }

    try {
      const requestBody: NovaLiteAIRequest = {
        messages: [
          {
            role: 'user',
            content: [{ 
              text: `You are a water monitoring expert AI assistant. Answer this question about water management and monitoring systems: ${question}` 
            }]
          }
        ],
        inferenceConfig: {
          maxTokens: 500,
          temperature: 0.6,
          topP: 0.8        }
      };

      // Use AWS SDK to invoke the model
      const command = new InvokeModelCommand({
        modelId: this.modelId,
        body: JSON.stringify(requestBody),
        contentType: "application/json"
      });

      const response = await this.client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body)) as NovaLiteResponse;
      
      return responseBody.output?.message?.content?.[0]?.text || 'Sorry, I could not process your question.';
    } catch (error) {
      console.error('Error calling Nova Lite API for Q&A:', error);
      return 'I apologize, but I am currently unable to process your question. Please try again later or use another AI model.';
    }
  }

  private createWaterAnalysisPrompt(sensorData: WaterSensorData[]): string {
    const dataDescription = sensorData.map(sensor => 
      `Sensor ${sensor.device_name || sensor.device_id}: Water level ${sensor.water_level}, Temperature: ${sensor.temperature}°C, Location: ${sensor.location?.latitude || 'N/A'}, ${sensor.location?.longitude || 'N/A'}`
    ).join('\n');

    return `As a water monitoring AI expert, analyze the following sensor data and provide actionable insights for water management:

${dataDescription}

Please provide insights in the following format:
1. Current Status Assessment
2. Risk Analysis (flooding, drought, system issues)
3. Actionable Recommendations
4. Maintenance Alerts (if any)

Focus on practical, actionable advice for water resource management and early warning systems.`;
  }

  private parseInsights(responseText: string): AIInsight[] {
    const insights: AIInsight[] = [];
    const lines = responseText.split('\n').filter(line => line.trim());
    
    let currentType: AIInsight['type'] = 'irrigation_advice';
    let currentSeverity: AIInsight['severity'] = 'info';

    for (const line of lines) {
      const cleanLine = line.trim();
      if (!cleanLine || cleanLine.length < 10) continue;

      // Determine insight type and severity based on content
      if (cleanLine.toLowerCase().includes('flood') || cleanLine.toLowerCase().includes('overflow')) {
        currentType = 'flood_warning';
        currentSeverity = 'critical';
      } else if (cleanLine.toLowerCase().includes('maintenance') || cleanLine.toLowerCase().includes('repair')) {
        currentType = 'maintenance_alert';
        currentSeverity = 'warning';
      } else if (cleanLine.toLowerCase().includes('quality') || cleanLine.toLowerCase().includes('contamination')) {
        currentType = 'quality_concern';
        currentSeverity = 'warning';
      } else {
        currentType = 'irrigation_advice';
        currentSeverity = 'info';
      }

      insights.push({
        id: `nova-lite-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        message: cleanLine,
        severity: currentSeverity,
        timestamp: new Date().toISOString(),
        type: currentType,
        confidence_score: 0.85
      });
    }

    return insights.slice(0, 3); // Limit to 3 insights
  }
  private generateFallbackInsights(sensorData: WaterSensorData[]): AIInsight[] {
    const criticalSensors = sensorData.filter(s => s.water_level === 'CRITICAL');
    const highSensors = sensorData.filter(s => s.water_level === 'HIGH');
    
    const insights: AIInsight[] = [];

    if (!this.isConfigured) {
      insights.push({
        id: `nova-lite-config-${Date.now()}-1`,
        message: `Nova Lite AI is available but requires AWS configuration. To enable Nova Lite, set up your AWS credentials in the environment variables. Currently using simulated insights.`,
        severity: 'info',
        timestamp: new Date().toISOString(),
        type: 'maintenance_alert',
        confidence_score: 1.0
      });
    }

    if (criticalSensors.length > 0) {
      insights.push({
        id: `nova-lite-fallback-${Date.now()}-1`,
        message: `Critical water levels detected in ${criticalSensors.length} sensor(s). Immediate attention required for flood prevention.`,
        severity: 'critical',
        timestamp: new Date().toISOString(),
        type: 'flood_warning',
        confidence_score: 0.9
      });
    }

    if (highSensors.length > 0) {
      insights.push({
        id: `nova-lite-fallback-${Date.now()}-2`,
        message: `Elevated water levels in ${highSensors.length} location(s). Monitor closely for potential flooding.`,
        severity: 'warning',
        timestamp: new Date().toISOString(),
        type: 'flood_warning',
        confidence_score: 0.8
      });
    }

    if (insights.length < 3) {
      insights.push({
        id: `nova-lite-fallback-${Date.now()}-3`,
        message: `${this.isConfigured ? 'Nova Lite AI analysis:' : 'Simulated analysis:'} Based on current sensor readings, maintain regular monitoring schedule and ensure backup systems are operational.`,
        severity: 'info',
        timestamp: new Date().toISOString(),
        type: 'irrigation_advice',
        confidence_score: 0.7
      });
    }

    return insights;
  }
}

export const novaLiteAI = new NovaLiteAIService();
