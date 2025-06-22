import { NextRequest, NextResponse } from 'next/server';
import { nvidiaAIService } from '@/lib/nvidia-ai';
import { WaterSensorData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { sensorData, question } = await request.json();
    
    // Handle Q&A requests - NVIDIA doesn't have a Q&A method, so we'll provide a fallback
    if (question && typeof question === 'string') {
      const fallbackAnswer = `NVIDIA AI Analysis: Your question "${question}" relates to water management. Based on the current HydroScribe sensor network, I can provide flood prediction and advanced analytics. NVIDIA NIM specializes in real-time flood prediction using Llama 3.1 Nemotron 70B. For specific water management questions, please refer to the automated insights generated from your sensor data, which include flood risk assessments and irrigation recommendations.`;
      return NextResponse.json({ answer: fallbackAnswer });
    }
    
    if (!sensorData || !Array.isArray(sensorData)) {
      return NextResponse.json(
        { error: 'Invalid sensor data provided' },
        { status: 400 }
      );
    }

    const insights = await nvidiaAIService.generateWaterInsights(sensorData as WaterSensorData[]);
    
    return NextResponse.json({ insights });
  } catch (error) {
    console.error('Error generating NVIDIA insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}

// Additional endpoint for flood prediction
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sensorDataParam = searchParams.get('sensorData');
    
    if (!sensorDataParam) {
      return NextResponse.json(
        { error: 'Sensor data required' },
        { status: 400 }
      );
    }

    const sensorData = JSON.parse(sensorDataParam) as WaterSensorData[];
    const prediction = await nvidiaAIService.generateFloodPrediction(sensorData);
    
    return NextResponse.json({ prediction });
  } catch (error) {
    console.error('Error generating flood prediction:', error);
    return NextResponse.json(
      { error: 'Failed to generate flood prediction' },
      { status: 500 }
    );
  }
}
