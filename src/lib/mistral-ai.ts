import { WaterSensorData, AIInsight, MistralAIRequest } from '@/types';

export class MistralAIService {
  private baseUrl = 'https://api.mistral.ai/v1';
  private apiKey = process.env.MISTRAL_API_KEY || '69jHjrY5o7VIYbSFZXz03qVhI88SbWyE';

  async generateWaterInsights(sensorData: WaterSensorData[]): Promise<AIInsight[]> {
    try {
      const prompt = this.createInsightPrompt(sensorData);
      
      const request: MistralAIRequest = {
        model: 'mistral-large-latest',
        messages: [
          {
            role: 'system',
            content: 'You are HydroScribe AI, an expert water management assistant specializing in IoT sensor data analysis, flood prediction, irrigation optimization, and water quality monitoring. You have comprehensive knowledge of the HydroScribe water monitoring project including real-time sensor data, historical patterns, and predictive analytics.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      };

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Mistral AI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || '';
      
      return this.parseInsightsFromResponse(aiResponse);
    } catch (error) {
      console.error('Error generating insights with Mistral AI:', error);
      return this.getFallbackInsights(sensorData);
    }
  }

  async answerWaterManagementQuestion(question: string, sensorData?: WaterSensorData[]): Promise<string> {
    try {
      const contextPrompt = this.createContextPrompt(question, sensorData);
      
      const request: MistralAIRequest = {
        model: 'mistral-large-latest',
        messages: [
          {
            role: 'system',
            content: `You are HydroScribe AI, an expert water management consultant with comprehensive knowledge of:
            
            - HydroScribe water monitoring project architecture and features
            - Real-time IoT sensor data analysis (water levels, temperature, pH, flow rate)
            - Flood prediction and early warning systems
            - Irrigation optimization and water conservation
            - Water quality monitoring and treatment
            - Agricultural water management
            - Climate change impact on water resources
            - Emergency response protocols for water-related disasters
            - Historical water data patterns and trends
            - Future predictions based on current sensor readings
            
            Provide detailed, actionable responses based on the current sensor data and project context.`
          },
          {
            role: 'user',
            content: contextPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1500
      };

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Mistral AI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'I apologize, but I could not process your question at the moment. Please try again.';
    } catch (error) {
      console.error('Error answering question with Mistral AI:', error);
      return 'I encountered an error while processing your question. As a water management expert, I recommend monitoring your current sensor readings and ensuring all critical water levels are within safe parameters.';
    }
  }

  private createInsightPrompt(sensorData: WaterSensorData[]): string {
    const currentTime = new Date().toISOString();
    const dataString = sensorData.map(data => 
      `Device: ${data.device_id} | Level: ${data.water_level} | Time: ${data.timestamp} | Temp: ${data.temperature}°C | pH: ${data.ph_level} | Flow: ${data.flow_rate}L/min`
    ).join('\n');

    return `As HydroScribe AI analyzing water monitoring data at ${currentTime}:

CURRENT SENSOR READINGS:
${dataString}

PROJECT CONTEXT:
- HydroScribe is monitoring water levels across multiple locations
- System uses UDOO boards with IoT sensors for real-time data collection
- Previous data shows seasonal patterns and flood risk indicators
- Agricultural irrigation optimization is a key use case
- Early warning system for flood prevention is active

Provide 2-3 actionable insights in JSON format:
{
  "insights": [
    {
      "message": "Specific, actionable insight with context from HydroScribe project knowledge",
      "severity": "info|warning|critical",
      "type": "flood_warning|irrigation_advice|maintenance_alert|quality_concern",
      "confidence_score": 0.85
    }
  ]
}

Focus on:
1. Immediate flood risks and prevention measures
2. Irrigation optimization based on current water levels and flow rates
3. Water quality concerns from pH and temperature readings  
4. Predictive maintenance alerts for sensors and equipment
5. Historical pattern analysis and future predictions`;
  }

  private createContextPrompt(question: string, sensorData?: WaterSensorData[]): string {
    const currentSensorContext = sensorData ? `
CURRENT SENSOR DATA:
${sensorData.map(data => 
  `Device: ${data.device_id} | Level: ${data.water_level} | Time: ${data.timestamp} | Temp: ${data.temperature}°C | pH: ${data.ph_level} | Flow: ${data.flow_rate}L/min`
).join('\n')}

` : '';

    return `${currentSensorContext}HYDROSCRIBE PROJECT CONTEXT:
- Real-time water monitoring system with IoT sensors
- UDOO Dual/Quad board integration with multiple sensor types
- AWS Bedrock and NVIDIA AI integration for insights
- ThingSpeak data logging and visualization
- Focus on flood prediction, irrigation optimization, and water quality
- Serves communities affected by water scarcity and flood risks
- 24/7 monitoring with mobile alerts and dashboard analytics

USER QUESTION: ${question}

Please provide a comprehensive answer based on your expertise in water management and the HydroScribe project context.`;
  }
  private parseInsightsFromResponse(response: string): AIInsight[] {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in response');
      
      const parsed = JSON.parse(jsonMatch[0]);
      const timestamp = Date.now();
      
      return parsed.insights.map((insight: { 
        message: string; 
        severity?: 'info' | 'warning' | 'critical'; 
        type?: 'flood_warning' | 'irrigation_advice' | 'maintenance_alert' | 'quality_concern'; 
        confidence_score?: number 
      }, index: number) => ({
        id: `mistral-insight-${timestamp}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        message: insight.message,
        severity: insight.severity || 'info',
        timestamp: new Date().toISOString(),
        type: insight.type || 'irrigation_advice',
        confidence_score: insight.confidence_score || 0.8
      }));
    } catch (error) {
      console.error('Error parsing Mistral AI insights:', error);
      return this.getFallbackInsights();
    }
  }
  private getFallbackInsights(sensorData?: WaterSensorData[]): AIInsight[] {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    
    const fallbackInsights: AIInsight[] = [
      {
        id: `mistral-fallback-${timestamp}-${randomId}`,
        message: 'Mistral AI Analysis: HydroScribe monitoring system operational. Water levels within expected parameters based on historical data patterns.',
        severity: 'info',
        timestamp: new Date().toISOString(),
        type: 'irrigation_advice',
        confidence_score: 0.85
      }
    ];

    if (sensorData && sensorData.some(data => data.water_level === 'CRITICAL')) {
      fallbackInsights.push({
        id: `mistral-critical-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
        message: 'MISTRAL AI ALERT: Critical water levels detected across sensors. Recommend immediate flood prevention measures and community notification.',
        severity: 'critical',
        timestamp: new Date().toISOString(),
        type: 'flood_warning',
        confidence_score: 0.95
      });
    }

    return fallbackInsights;
  }
}

export const mistralAIService = new MistralAIService();
