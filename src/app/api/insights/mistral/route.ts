import { NextRequest, NextResponse } from 'next/server';
import { mistralAIService } from '@/lib/mistral-ai';
import { WaterSensorData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { sensorData, question } = await request.json();
    
    // Handle Q&A requests
    if (question && typeof question === 'string') {
      const answer = await mistralAIService.answerWaterManagementQuestion(question, sensorData);
      return NextResponse.json({ answer });
    }
    
    // Handle insights generation
    if (!sensorData || !Array.isArray(sensorData)) {
      return NextResponse.json(
        { error: 'Invalid sensor data provided' },
        { status: 400 }
      );
    }

    const insights = await mistralAIService.generateWaterInsights(sensorData as WaterSensorData[]);
    
    return NextResponse.json({ insights });
  } catch (error) {
    console.error('Error with Mistral AI:', error);
    return NextResponse.json(
      { error: 'Failed to process request with Mistral AI' },
      { status: 500 }
    );
  }
}
