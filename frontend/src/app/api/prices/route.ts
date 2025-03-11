import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json(
      { success: false, error: 'Symbol parameter is required' },
      { status: 400 }
    );
  }

  try {
    // For MON token, use the Pyth price feed
    if (symbol === 'MON') {
      const pythResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pyth/mon-price`);
      const pythData = await pythResponse.json();
      
      if (!pythResponse.ok) {
        throw new Error('Failed to fetch MON price from Pyth');
      }

      // Transform Pyth data into our expected format
      return NextResponse.json({
        success: true,
        data: [{
          timestamp: new Date().toISOString(),
          price: pythData.price.price
        }]
      });
    }

    // For other tokens, use the events/prices endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/prices?symbol=${symbol}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch price data');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching price data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch price data' },
      { status: 500 }
    );
  }
} 