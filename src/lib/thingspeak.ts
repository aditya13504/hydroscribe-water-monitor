import { ThingSpeakData, WaterSensorData } from '@/types';

export class ThingSpeakService {
  private baseUrl = 'https://api.thingspeak.com';
  
  async getChannelData(channelId: string, apiKey?: string, results: number = 20): Promise<WaterSensorData[]> {
    try {
      const url = new URL(`${this.baseUrl}/channels/${channelId}/feeds.json`);
      url.searchParams.set('results', results.toString());
      if (apiKey) {
        url.searchParams.set('api_key', apiKey);
      }

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`ThingSpeak API error: ${response.status}`);
      }

      const data: ThingSpeakData = await response.json();
      return this.convertToWaterSensorData(data);
    } catch (error) {
      console.error('Error fetching ThingSpeak data:', error);
      // Return mock data for demonstration
      return this.getMockData();
    }
  }

  async writeChannelData(
    channelId: string, 
    writeApiKey: string, 
    data: { [key: string]: string | number }
  ): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/update`;
      const formData = new URLSearchParams();
      formData.append('api_key', writeApiKey);
      
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      const result = await response.text();
      return result !== '0'; // ThingSpeak returns 0 on failure
    } catch (error) {
      console.error('Error writing to ThingSpeak:', error);
      return false;
    }
  }

  private convertToWaterSensorData(data: ThingSpeakData): WaterSensorData[] {
    return data.feeds.map((feed, index) => {
      const waterLevel = this.parseWaterLevel(feed.field1);
      const temperature = parseFloat(feed.field2 || '0');
      const phLevel = parseFloat(feed.field3 || '7.0');
      const flowRate = parseFloat(feed.field4 || '0');

      return {
        device_id: `thingspeak-${data.channel.id}-${index}`,
        water_level: waterLevel,
        timestamp: feed.created_at,
        location: {
          latitude: parseFloat(data.channel.latitude || '0'),
          longitude: parseFloat(data.channel.longitude || '0')
        },
        temperature: temperature || undefined,
        ph_level: phLevel || undefined,
        flow_rate: flowRate || undefined
      };
    });
  }

  private parseWaterLevel(value?: string): 'HIGH' | 'LOW' | 'CRITICAL' {
    if (!value) return 'LOW';
    
    const numValue = parseFloat(value);
    if (numValue > 80) return 'CRITICAL';
    if (numValue > 50) return 'HIGH';
    return 'LOW';
  }

  private getMockData(): WaterSensorData[] {
    const mockData: WaterSensorData[] = [];
    const now = new Date();
    
    for (let i = 0; i < 20; i++) {
      const timestamp = new Date(now.getTime() - i * 5 * 60 * 1000); // 5 minutes apart
      const waterLevels: ('HIGH' | 'LOW' | 'CRITICAL')[] = ['HIGH', 'LOW', 'CRITICAL'];
      
      mockData.push({
        device_id: `demo-sensor-${Math.floor(i / 5) + 1}`,
        water_level: waterLevels[Math.floor(Math.random() * waterLevels.length)],
        timestamp: timestamp.toISOString(),
        location: {
          latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
          longitude: -74.0060 + (Math.random() - 0.5) * 0.1
        },
        temperature: 20 + Math.random() * 15,
        ph_level: 6.5 + Math.random() * 2,
        flow_rate: Math.random() * 100
      });
    }
    
    return mockData.reverse(); // Most recent first
  }

  // Demo channel data for the hackathon
  async getDemoChannelData(): Promise<WaterSensorData[]> {
    // Using a public demo channel or creating mock data
    const demoChannelId = '1417';
    
    try {
      return await this.getChannelData(demoChannelId);
    } catch (error) {
      console.log('Using mock data for demo');
      return this.getMockData();
    }
  }
}

export const thingSpeakService = new ThingSpeakService();
