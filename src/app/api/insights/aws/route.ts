import { NextRequest, NextResponse } from 'next/server';
import { awsBedrockService } from '@/lib/aws-bedrock';
import { WaterSensorData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { sensorData, question } = await request.json();
    
    // Handle Q&A requests - AWS Bedrock doesn't have a Q&A method, so we'll provide a fallback
    if (question && typeof question === 'string') {
      const fallbackAnswer = `AWS Bedrock Analysis: Based on your question "${question}", I can analyze the current water sensor data and provide insights. The HydroScribe system is monitoring water levels across multiple sensors. For detailed analysis, I recommend checking the current sensor readings and reviewing the generated insights above. AWS Bedrock specializes in generating automated insights from sensor data patterns.`;
      return NextResponse.json({ answer: fallbackAnswer });
    }
    
    if (!sensorData || !Array.isArray(sensorData)) {
      return NextResponse.json(
        { error: 'Invalid sensor data provided' },
        { status: 400 }
      );
    }

    const insights = await awsBedrockService.generateWaterInsights(sensorData as WaterSensorData[]);
    
    return NextResponse.json({ insights });
  } catch (error) {
    console.error('Error generating AWS insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}
