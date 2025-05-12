import { NextRequest, NextResponse } from 'next/server';
import cache from '../../../lib/server-cache';

// Declare a global variable to temporarily store the data
declare global {
  var apiData: any;
}

export async function POST(req: NextRequest) {
  try {
    const data: { apiData: any; selectedTone: string } = await req.json();
    const dataSetName = data.dataSetName;
    // Retrieve the user's session ID (replace with your actual session ID retrieval logic)
    const sessionId = 'your-session-id'; // Replace with your session ID retrieval logic

    // If the session ID doesn't exist in the cache, initialize it
    if (!cache[sessionId]) {
      cache[sessionId] = {};
    }

    // Store the data using the dataSetName as the key and log
    cache[sessionId][dataSetName] = { apiData: data.apiData, selectedTone: data.selectedTone };
    console.log(`[API] Data stored for session ID: ${sessionId}, dataset: ${dataSetName}`);

    return NextResponse.json({ message: 'Data stored successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error storing data:', error);
    return NextResponse.json({ message: 'Error storing data' }, { status: 500 });
  }
}