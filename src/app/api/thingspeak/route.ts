import { NextRequest, NextResponse } from 'next/server';
import { thingSpeakService } from '@/lib/thingspeak';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get('channelId');
    const results = parseInt(searchParams.get('results') || '20');
    
    if (!channelId) {
      // Use demo data
      const data = await thingSpeakService.getDemoChannelData();
      return NextResponse.json({ data });
    }

    const data = await thingSpeakService.getChannelData(channelId, undefined, results);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching ThingSpeak data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { channelId, writeApiKey, data } = await request.json();
    
    if (!channelId || !writeApiKey || !data) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const success = await thingSpeakService.writeChannelData(channelId, writeApiKey, data);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to write data' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error writing ThingSpeak data:', error);
    return NextResponse.json(
      { error: 'Failed to write data' },
      { status: 500 }
    );
  }
}
