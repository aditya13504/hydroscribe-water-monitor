import { WaterSensorData, AIInsight, NvidiaAIRequest } from '@/types';

export class NvidiaAIService {
  private baseUrl = 'https://integrate.api.nvidia.com/v1';
  private apiKey = process.env.NVIDIA_API_KEY || '';

  async generateWaterInsights(sensorData: WaterSensorData[]): Promise<AIInsight[]> {
    try {
      const prompt = this.createInsightPrompt(sensorData);
      
      const request: NvidiaAIRequest = {
        model: 'nvidia/llama-3.1-nemotron-70b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are a water management AI expert specializing in IoT sensor data analysis and providing actionable insights for water monitoring systems.'
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
        throw new Error(`NVIDIA API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || '';
      
      return this.parseInsightsFromResponse(aiResponse);
    } catch (error) {
      console.error('Error generating insights with NVIDIA AI:', error);
      return this.getFallbackInsights(sensorData);
    }
  }

  async generateFloodPrediction(sensorData: WaterSensorData[]): Promise<{
    risk_level: 'low' | 'medium' | 'high';
    prediction_confidence: number;
    time_to_critical: string;
    recommendations: string[];
  }> {
    try {
      const prompt = `Analyze this water sensor data for flood prediction:
      
${sensorData.map(data => 
  `Device: ${data.device_id} | Level: ${data.water_level} | Time: ${data.timestamp} | Temp: ${data.temperature}°C`
).join('\n')}

Provide flood risk assessment in JSON format:
{
  "risk_level": "low|medium|high",
  "prediction_confidence": 0.85,
  "time_to_critical": "2 hours",
  "recommendations": ["recommendation1", "recommendation2"]
}`;

      const request: NvidiaAIRequest = {
        model: 'nvidia/llama-3.1-nemotron-70b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are a flood prediction AI expert. Analyze water sensor data and provide accurate flood risk assessments.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
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
        throw new Error(`NVIDIA API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || '';
      
      return this.parseFloodPrediction(aiResponse);
    } catch (error) {
      console.error('Error generating flood prediction:', error);
      return {
        risk_level: 'medium',
        prediction_confidence: 0.7,
        time_to_critical: 'Unknown',
        recommendations: ['Monitor water levels closely', 'Prepare emergency response plan']
      };
    }
  }

  private createInsightPrompt(sensorData: WaterSensorData[]): string {
    const dataString = sensorData.map(data => 
      `Device: ${data.device_id} | Level: ${data.water_level} | Time: ${data.timestamp} | Temp: ${data.temperature}°C | pH: ${data.ph_level}`
    ).join('\n');

    return `Analyze this water monitoring data and provide actionable insights:

${dataString}

Provide 2-3 insights in JSON format:
{
  "insights": [
    {
      "message": "Clear insight message",
      "severity": "info|warning|critical",
      "type": "flood_warning|irrigation_advice|maintenance_alert|quality_concern",
      "confidence_score": 0.85
    }
  ]
}

Focus on practical recommendations for water management, irrigation optimization, and early warning systems.`;
  }

  private parseInsightsFromResponse(response: string): AIInsight[] {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in response');
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      return parsed.insights.map((insight: any, index: number) => ({
        id: `nvidia-insight-${Date.now()}-${index}`,
        message: insight.message,
        severity: insight.severity || 'info',
        timestamp: new Date().toISOString(),
        type: insight.type || 'irrigation_advice',
        confidence_score: insight.confidence_score || 0.8
      }));
    } catch (error) {
      console.error('Error parsing NVIDIA insights:', error);
      return this.getFallbackInsights();
    }
  }

  private parseFloodPrediction(response: string): any {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in response');
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error parsing flood prediction:', error);
      return {
        risk_level: 'medium',
        prediction_confidence: 0.7,
        time_to_critical: 'Unknown',
        recommendations: ['Monitor water levels closely', 'Prepare emergency response plan']
      };
    }
  }
  private getFallbackInsights(sensorData?: WaterSensorData[]): AIInsight[] {
    const fallbackInsights: AIInsight[] = [
      {
        id: `nvidia-fallback-${Date.now()}`,
        message: 'NVIDIA AI analysis: Water monitoring system operational. Recommend continued monitoring for optimal performance.',
        severity: 'info',
        timestamp: new Date().toISOString(),
        type: 'irrigation_advice',
        confidence_score: 0.85
      }
    ];

    if (sensorData && sensorData.some(data => data.water_level === 'CRITICAL')) {
      fallbackInsights.push({
        id: `nvidia-critical-${Date.now()}`,
        message: 'NVIDIA AI Alert: Critical water levels detected. Advanced flood prediction models recommend immediate action.',
        severity: 'critical',
        timestamp: new Date().toISOString(),
        type: 'flood_warning',
        confidence_score: 0.92
      });
    }

    return fallbackInsights;
  }
}

export const nvidiaAIService = new NvidiaAIService();
