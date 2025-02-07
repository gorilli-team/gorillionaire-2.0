import React, { useEffect, useRef } from "react";
import SentimentChart from "../sentiment_chart";

interface VaultStatsProps {
  vaultName: string;
}

const VaultStats: React.FC<VaultStatsProps> = ({ vaultName }) => {

    const sentimentData = [
        { date: "Feb 05", sentiment: 10 },
        { date: "Feb 06", sentiment: -5 },
        { date: "Feb 07", sentiment: -20 },
        { date: "Feb 08", sentiment: 8 },
        { date: "Feb 09", sentiment: 25 },
        { date: "Feb 10", sentiment: -12 },
    ];

    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chartContainerRef.current) {
            new window.TradingView.widget({
                autosize: true,
                symbol: "BINANCE:ETHUSDT",
                interval: "60",
                container_id: chartContainerRef.current.id,
                theme: "dark", 
                style: "2",
                locale: "en",
                toolbar_bg: "#f1f3f6",
                hide_side_toolbar: true,
                allow_symbol_change: true,
            });
        }
    }, []);

  return (
    <div className="p-4">
      <h3 className="text-md font-semibold mb-2">Details</h3>
      <div className="border p-4 rounded-lg mb-4 bg-gray-100">
        <div className="flex justify-between pb-2">
          <strong>Vault name:</strong>
          <span>{vaultName}</span>
        </div>
        <div className="flex justify-between pb-2">
          <strong>List date:</strong>
          <span>05/02/2025</span>
        </div>
        <div className="flex justify-between pb-2">
          <strong>Chain:</strong>
          <div className="flex">
            <img className="w-6 h-6" src="/base.jpg" alt="img-base" />
            <span className="ps-1">Base</span>
          </div>
        </div>
        <div className="flex justify-between pb-2">
          <strong>Contract address:</strong>
          <span>0x4173151106c668B79fb2aF40e6894f12A91B4d2F</span>
        </div>
        <div className="flex justify-between pb-2">
          <strong>APY:</strong>
          <span>3.5%</span>
        </div>
        <div className="flex justify-between pb-2">
          <strong>TVL:</strong>
          <span>$138,297.78</span>
        </div>
      </div>
      <div className="flex w-full gap-2">
        <div className="border p-4 bg-gray-100 w-1/2">
            <SentimentChart data={sentimentData} />
        </div>
        <div className="border p-4 rounded-lg bg-gray-100 w-1/2">
            <div ref={chartContainerRef} id="tradingview-chart" style={{ height: "440px", borderRadius: "0.5rem"}} />
        </div>
      </div>
    </div>
  );
};

export default VaultStats;