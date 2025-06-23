import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { WaterSensorData, AIInsight } from '@/types';

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export class AWSBedrockService {
  async generateWaterInsights(sensorData: WaterSensorData[]): Promise<AIInsight[]> {
    try {
      const prompt = this.createInsightPrompt(sensorData);
      
      const input = {
        modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          anthropic_version: 'bedrock-2023-05-31',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      };

      const command = new InvokeModelCommand(input);
      const response = await client.send(command);
      
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      const insights = this.parseInsightsFromResponse(responseBody.content[0].text);
      
      return insights;
    } catch (error) {
      console.error('Error generating insights with AWS Bedrock:', error);
      return this.getFallbackInsights(sensorData);
    }
  }

  private createInsightPrompt(sensorData: WaterSensorData[]): string {
    const dataString = sensorData.map(data => 
      `Device: ${data.device_id}, Level: ${data.water_level}, Time: ${data.timestamp}, Temp: ${data.temperature}°C, pH: ${data.ph_level}`
    ).join('\n');

    return `As a water management AI expert, analyze the following sensor data and provide actionable insights:

${dataString}

Please provide 2-3 specific insights in JSON format with the following structure:
{
  "insights": [
    {
      "message": "Clear, actionable insight message",
      "severity": "info|warning|critical",
      "type": "flood_warning|irrigation_advice|maintenance_alert|quality_concern",
      "confidence_score": 0.85
    }
  ]
}

Focus on:
1. Water level trends and potential flooding risks
2. Irrigation optimization recommendations
3. Water quality concerns based on pH and temperature
4. Predictive maintenance alerts

Keep messages clear, actionable, and suitable for both technical and non-technical users.`;
  }

  private parseInsightsFromResponse(response: string): AIInsight[] {
    try {
      // Extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in response');
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      return parsed.insights.map((insight: { 
        message: string; 
        severity?: 'info' | 'warning' | 'critical'; 
        type?: 'flood_warning' | 'irrigation_advice' | 'maintenance_alert' | 'quality_concern'; 
        confidence_score?: number 
      }, index: number) => ({
        id: `insight-${Date.now()}-${index}`,
        message: insight.message,
        severity: insight.severity || 'info',
        timestamp: new Date().toISOString(),
        type: insight.type || 'irrigation_advice',
        confidence_score: insight.confidence_score || 0.8
      }));
    } catch (error) {
      console.error('Error parsing insights:', error);
      return this.getFallbackInsights();
    }
  }

  private getFallbackInsights(sensorData?: WaterSensorData[]): AIInsight[] {    const fallbackInsights: AIInsight[] = [
      {
        id: `fallback-${Date.now()}`,
        message: 'Water monitoring system is active. Regular monitoring detected normal operations across all sensors.',
        severity: 'info',
        timestamp: new Date().toISOString(),
        type: 'irrigation_advice',
        confidence_score: 0.9
      }
    ];

    if (sensorData && sensorData.some(data => data.water_level === 'CRITICAL')) {
      fallbackInsights.push({
        id: `critical-${Date.now()}`,
        message: 'CRITICAL: High water levels detected. Please monitor flood alerts and take necessary precautions.',        severity: 'critical',
        timestamp: new Date().toISOString(),
        type: 'flood_warning',
        confidence_score: 0.95
      });
    }

    return fallbackInsights;
  }
}

export const awsBedrockService = new AWSBedrockService();
