'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { IChartApi, createChart, ColorType, LineSeries } from 'lightweight-charts';

interface PriceData {
  time: string;
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
      const lineSeries = chart.addSeries(LineSeries, {
        color: '#2962FF',
        lineWidth: 2,
      });

      // Transform data to ensure proper time format and unique ascending timestamps
      const formattedData = data
        .map((item, index) => ({
          time: item.time.split('T')[0], // Ensure we only use the date part
          value: item.value,
          originalIndex: index // Keep track of original order for duplicate dates
        }))
        // Remove duplicates by keeping the latest value for each date
        .reduce((acc, curr) => {
          acc[curr.time] = curr;
          return acc;
        }, {} as Record<string, typeof data[0] & { originalIndex: number }>);

      // Convert back to array and sort by time
      const uniqueSortedData = Object.values(formattedData)
        .sort((a, b) => {
          const timeCompare = a.time.localeCompare(b.time);
          return timeCompare === 0 ? a.originalIndex - b.originalIndex : timeCompare;
        })
        .map(({ time, value }) => ({ time, value }));

      // Set the data
      lineSeries.setData(uniqueSortedData);

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