import { NextRequest, NextResponse } from 'next/server';

// Declare a global variable to temporarily store the data
declare global {
  var apiData: any;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Temporarily store the data in a global variable
    global.apiData = data;

    return NextResponse.json({ message: 'Data stored successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error storing data:', error);
    return NextResponse.json({ message: 'Error storing data' }, { status: 500 });
  }
}