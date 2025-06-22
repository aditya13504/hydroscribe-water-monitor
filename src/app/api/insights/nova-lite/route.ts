import { NextRequest, NextResponse } from 'next/server';
import { novaLiteAI } from '@/lib/nova-lite-ai';
import { WaterSensorData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sensorData, question } = body;

    // Handle Q&A requests
    if (question) {
      const response = await novaLiteAI.generateQAResponse(question);
      return NextResponse.json({ answer: response });
    }

    // Handle insights generation
    if (!sensorData || !Array.isArray(sensorData)) {
      return NextResponse.json(
        { error: 'Invalid sensor data provided' },
        { status: 400 }
      );
    }

    const insights = await novaLiteAI.generateWaterInsights(sensorData as WaterSensorData[]);
    
    return NextResponse.json({ insights });
  } catch (error) {
    console.error('Nova Lite API route error:', error);
    
    // Check if it's a configuration error
    if (error instanceof Error && error.message.includes('credentials not configured')) {
      return NextResponse.json({
        error: 'Nova Lite requires AWS configuration. Please set up your AWS credentials.',
        fallback: true
      }, { status: 200 }); // Return 200 so the frontend can handle gracefully
    }
    
    return NextResponse.json(
      { error: 'Failed to generate insights with Nova Lite' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    model: 'Amazon Nova Lite',
    version: '1.0',
    status: 'active',
    capabilities: [
      'Water monitoring analysis',
      'Risk assessment',
      'Maintenance recommendations',
      'Q&A support'
    ]
  });
}
