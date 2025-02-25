"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { trackedTokens, TokenData } from "../../shared/tokenData";
import Sidebar from "../../components/sidebar";
import Header from "../../components/header";

interface TokenEvent {
  id: string;
  type: "PRICE_CHANGE" | "VOLUME_SPIKE" | "HOLDER_CHANGE" | "SIGNAL";
  timestamp: string;
  description: string;
  value: string;
  impact: "HIGH" | "MEDIUM" | "LOW";
}

const TokenPage = ({ params }: { params: { address: string } }) => {
  const [token, setToken] = useState<TokenData | null>(null);
  const [selectedPage, setSelectedPage] = useState("Tokens");
  const [events, setEvents] = useState<TokenEvent[]>([]);

  useEffect(() => {
    const tokenData = trackedTokens.find(
      (t) => t.address.toLowerCase() === params.address.toLowerCase()
    );
    setToken(tokenData || null);

    // Mock events data - replace with actual API call
    const mockEvents: TokenEvent[] = [
      {
        id: "1",
        type: "PRICE_CHANGE",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        description: "Price increased significantly",
        value: "+15.5%",
        impact: "HIGH",
      },
      {
        id: "2",
        type: "VOLUME_SPIKE",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        description: "Unusual trading volume detected",
        value: "2.5x average",
        impact: "MEDIUM",
      },
      {
        id: "3",
        type: "HOLDER_CHANGE",
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        description: "New whale wallet detected",
        value: "+500,000 tokens",
        impact: "HIGH",
      },
    ];
    setEvents(mockEvents);
  }, [params.address]);

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "HIGH":
        return "bg-red-100 text-red-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "PRICE_CHANGE":
        return "💰";
      case "VOLUME_SPIKE":
        return "📈";
      case "HOLDER_CHANGE":
        return "👥";
      case "SIGNAL":
        return "🎯";
      default:
        return "📊";
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      <Sidebar selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            {/* Token Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center">
                {token.image ? (
                  <Image
                    src={token.image}
                    alt={token.name}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold">
                      {token.symbol[0]}
                    </span>
                  </div>
                )}
                <div className="ml-4">
                  <h1 className="text-2xl font-bold">{token.name}</h1>
                  <p className="text-gray-600">{token.symbol}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Tracked Since</p>
                  <p className="text-lg font-semibold">
                    {token.trackedSince || "N/A"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Signals Generated</p>
                  <p className="text-lg font-semibold">
                    {token.signalsGenerated || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Holders</p>
                  <p className="text-lg font-semibold">
                    {token.holders?.toLocaleString() || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Events Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6">Recent Events</h2>
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="border-l-4 border-blue-500 pl-4 py-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">
                          {getEventTypeIcon(event.type)}
                        </span>
                        <div>
                          <p className="font-semibold">{event.description}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(event.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{event.value}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getImpactColor(
                            event.impact
                          )}`}
                        >
                          {event.impact}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenPage;
