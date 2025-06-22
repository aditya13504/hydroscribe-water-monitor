import { NextRequest, NextResponse } from 'next/server';
import { geminiAIService } from '@/lib/gemini-ai';
import { WaterSensorData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { sensorData, question } = await request.json();
    
    // Handle Q&A requests
    if (question && typeof question === 'string') {
      const answer = await geminiAIService.answerWaterManagementQuestion(question, sensorData);
      return NextResponse.json({ answer });
    }
    
    // Handle insights generation
    if (!sensorData || !Array.isArray(sensorData)) {
      return NextResponse.json(
        { error: 'Invalid sensor data provided' },
        { status: 400 }
      );
    }

    const insights = await geminiAIService.generateWaterInsights(sensorData as WaterSensorData[]);
    
    return NextResponse.json({ insights });
  } catch (error) {
    console.error('Error with Gemini AI:', error);
    return NextResponse.json(
      { error: 'Failed to process request with Gemini AI' },
      { status: 500 }
    );
  }
}
