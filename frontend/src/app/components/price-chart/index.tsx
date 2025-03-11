'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { IChartApi, createChart, ColorType, LineSeries, AreaSeries, Time } from 'lightweight-charts';

interface PriceData {
  time: Time;
  value: number;
}

interface PriceChartProps {
  data: PriceData[];
  tokenSymbol: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, tokenSymbol }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [isClient, setIsClient] = useState(false);

  useLayoutEffect(() => {
    setIsClient(true);
  }, []);

  useLayoutEffect(() => {
    if (!isClient || !chartContainerRef.current || !data || data.length === 0) return;

    try {
      // Initialize chart
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: 'white' },
          textColor: 'black',
        },
        width: chartContainerRef.current.clientWidth,
        height: 300,
        grid: {
          vertLines: { visible: false },
          horzLines: { color: '#f0f0f0' },
        },
        rightPriceScale: {
          borderVisible: false,
        },
        timeScale: {
          borderVisible: false,
          timeVisible: true,
        },
      });

      // Create the line series
      const lineSeries = chart.addSeries(AreaSeries, { lineColor: '#2962FF', topColor: '#2962FF', bottomColor: 'rgba(41, 98, 255, 0.28)' });

      // Transform data to ensure proper time format and unique ascending timestamps
      const formattedData = data
        .map((item, index) => ({
          time: item.time as Time,
          value: item.value,
          originalIndex: index
        }))
        // Remove duplicates by keeping the latest value for each timestamp
        .reduce((acc, curr) => {
          const key = typeof curr.time === 'number' ? curr.time : curr.time.toString();
          acc[key] = curr;
          return acc;
        }, {} as Record<string, typeof data[0] & { originalIndex: number }>);

        console.log({formattedData});

      // Convert back to array and sort by timestamp
      const uniqueSortedData = Object.values(formattedData)
        .sort((a, b) => {
          // Convert both times to numbers for comparison
          const timeA = typeof a.time === 'number' ? a.time : new Date(a.time.toString()).getTime();
          const timeB = typeof b.time === 'number' ? b.time : new Date(b.time.toString()).getTime();
          const timeCompare = timeA - timeB;
          return timeCompare === 0 ? a.originalIndex - b.originalIndex : timeCompare;
        })
        .map(({ time, value }) => ({ time, value }));

      // Set the data

      console.log({uniqueSortedData});
      lineSeries.setData(uniqueSortedData);
      
      // Fit all data points into the visible area
      chart.timeScale().fitContent();

      // Handle resize
      const handleResize = () => {
        if (chartContainerRef.current && chart) {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };

      window.addEventListener('resize', handleResize);
      chartRef.current = chart;

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        if (chart) {
          chart.remove();
        }
      };
    } catch (error) {
      console.error('Error initializing chart:', error);
    }
  }, [data, isClient]);

  // Server-side and initial client render
  if (!isClient || !data || data.length === 0) {
    return (
      <div className="w-full p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">{tokenSymbol} Price Chart</h3>
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          {!isClient ? 'Loading...' : 'No price data available'}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">{tokenSymbol} Price Chart</h3>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
};

// Wrap the component with dynamic import and disable SSR
export default dynamic(() => Promise.resolve(PriceChart), { 
  ssr: false,
  loading: () => (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Loading Chart...</h3>
      <div className="h-[300px] flex items-center justify-center text-gray-500">
        Loading...
      </div>
    </div>
  )
}); 