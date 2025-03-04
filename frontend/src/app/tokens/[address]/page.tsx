"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Sidebar from "../../components/sidebar";
import Header from "../../components/header";
import { trackedTokens } from "@/app/shared/tokenData";
import Image from "next/image";

interface TokenData {
  address: string;
  name: string;
  symbol: string;
  image?: string;
  trackedSince?: string;
  signalsGenerated?: number;
  holders?: number;
}

interface TokenEvent {
  id: string;
  type: "PRICE_CHANGE" | "VOLUME_SPIKE" | "HOLDER_CHANGE" | "SIGNAL";
  timestamp: string;
  description: string;
  value: string;
  impact: "HIGH" | "MEDIUM" | "LOW";
}

export default function TokenPage() {
  const params = useParams();
  const [token, setToken] = useState<TokenData | null>(null);
  const [selectedPage, setSelectedPage] = useState("Tokens");
  const [events, setEvents] = useState<TokenEvent[]>([]);
  const [allEvents, setAllEvents] = useState<TokenEvent[]>([]);
  const [filterLabel, setFilterLabel] = useState("ALL");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [eventsNumber, setEventsNumber] = useState(0);
  const [newEventIds, setNewEventIds] = useState<Set<string>>(new Set());
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const fetchTokenData = async () => {
      if (!params.address) return;

      const tokenData = trackedTokens.find(
        (t: TokenData) =>
          t.address.toLowerCase() ===
          (typeof params.address === "string"
            ? params.address.toLowerCase()
            : undefined)
      );

      if (tokenData) {
        if (
          tokenData.name === "Chog" ||
          tokenData.name === "Molandak" ||
          tokenData.name === "Moyaki"
        ) {
          setToken(tokenData);
        } else {
          setToken(tokenData);
        }
      }

      if (tokenData) {
        if (
          tokenData.name === "Chog" ||
          tokenData.name === "Molandak" ||
          tokenData.name === "Moyaki"
        ) {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/events/token/${tokenData.name}`
            );
            const data = await response.json();
            console.log("data", data);
            setToken({
              ...tokenData,
              signalsGenerated: data?.pagination?.total,
            });
            setAllEvents(data?.events || []);
            setEvents(data?.events || []);
            return;
          } catch (error) {
            console.error("Error fetching events:", error);
          }
        } else {
          const randomEvents = generateRandomEvents(
            tokenData,
            tokenData.signalsGenerated || 3
          );
          setAllEvents(randomEvents);
          setEvents(randomEvents);
        }
      }
    };

    fetchTokenData();
  }, [params.address]);

  useEffect(() => {
    if (
      !token ||
      (token.name !== "Chog" &&
        token.name !== "Molandak" &&
        token.name !== "Moyaki")
    ) {
      return;
    }

    if (wsRef.current) {
      wsRef.current.close();
    }

    const wsUrl = `${process.env.NEXT_PUBLIC_API_URL}/events/token/${token.name}`;
    console.log(`Connecting to WebSocket: ${wsUrl}`);
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    wsRef.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("WebSocket message received:", message);

        if (message.type === "NEW_EVENT") {
          const newEvent = message.data;

          setNewEventIds((prevIds) => {
            const updatedIds = new Set(prevIds);
            updatedIds.add(newEvent.id);
            return updatedIds;
          });

          setEvents((prevEvents) => {
            if (prevEvents.some((e) => e.id === newEvent.id)) {
              return prevEvents;
            }
            return [newEvent, ...prevEvents];
          });

          setAllEvents((prevEvents) => {
            if (prevEvents.some((e) => e.id === newEvent.id)) {
              return prevEvents;
            }
            return [newEvent, ...prevEvents];
          });

          setEventsNumber((prev) => prev + 1);

          setTimeout(() => {
            setNewEventIds((prevIds) => {
              const updatedIds = new Set(prevIds);
              updatedIds.delete(newEvent.id);
              return updatedIds;
            });
          }, 5000);
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (wsRef.current) {
        console.log("Closing WebSocket connection");
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [token?.name, token]);

  useEffect(() => {
    const fetchFilteredEvents = async () => {
      if (!token) return;

      setPage(1);
      setHasMore(true);

      if (
        token.name === "Chog" ||
        token.name === "Molandak" ||
        token.name === "Moyaki"
      ) {
        try {
          setLoading(true);
          const filterParam =
            filterLabel === "ALL" ? "" : `&impact=${filterLabel}`;
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/events/token/${token.name}?page=1&limit=20${filterParam}`
          );
          const data = await response.json();

          if (data?.events) {
            setEvents(data.events);
            setEventsNumber(data.pagination.total);
            setHasMore(data.events.length === 20 && data.pagination.total > 20);
          } else {
            setEvents([]);
            setHasMore(false);
          }
        } catch (error) {
          console.error("Error fetching filtered events:", error);
          setEvents([]);
        } finally {
          setLoading(false);
        }
      } else {
        if (filterLabel === "ALL") {
          setEvents(allEvents);
        } else {
          const filteredEvents = allEvents.filter(
            (event) => event.impact === filterLabel
          );
          setEvents(filteredEvents);
        }
      }
    };

    fetchFilteredEvents();
  }, [filterLabel, token, allEvents]);

  const loadMoreEvents = async () => {
    if (!token || loading || !hasMore) return;

    setLoading(true);
    const nextPage = page + 1;

    try {
      if (
        token.name === "Chog" ||
        token.name === "Molandak" ||
        token.name === "Moyaki"
      ) {
        const filterParam =
          filterLabel === "ALL" ? "" : `&impact=${filterLabel}`;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/events/token/${token.name}?page=${nextPage}&limit=20${filterParam}`
        );
        const data = await response.json();

        if (data?.events && data.events.length > 0) {
          setEvents((prevEvents) => [...prevEvents, ...data.events]);
          setPage(nextPage);
          setHasMore(data.events.length === 20);
        } else {
          setHasMore(false);
        }
      } else {
        const newRandomEvents = generateRandomEvents(token, 20);

        if (filterLabel === "ALL") {
          setEvents((prevEvents) => [...prevEvents, ...newRandomEvents]);
        } else {
          const filteredNewEvents = newRandomEvents.filter(
            (event) => event.impact === filterLabel
          );
          setEvents((prevEvents) => [...prevEvents, ...filteredNewEvents]);
        }

        setAllEvents((prevEvents) => [...prevEvents, ...newRandomEvents]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more events:", error);
    } finally {
      setLoading(false);
    }
  };

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
      case "TRANSFER":
        return "💸";
      default:
        return "📊";
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      <Sidebar selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="container mx-auto px-4 py-8">
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
                  <p className="text-sm text-gray-600">Events Tracked</p>
                  <p className="text-lg font-semibold">{eventsNumber || 0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Holders</p>
                  <p className="text-lg font-semibold">
                    {token.holders?.toLocaleString() || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold mb-6">
                  Events ({eventsNumber})
                </h2>
                <select
                  className="w-full sm:w-auto bg-white border border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md px-3 py-2 text-sm font-medium text-gray-700 shadow-sm appearance-none cursor-pointer transition-colors duration-200 focus:outline-none"
                  value={filterLabel}
                  onChange={(e) => setFilterLabel(e.target.value)}
                >
                  <option value="ALL">All Events</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={`border-l-4 border-blue-500 pl-4 py-2 ${
                      newEventIds.has(event.id) ? "bg-green-200" : "bg-white"
                    } transition-all duration-700 ease-in-out`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">
                          {getEventTypeIcon(event.type)}
                        </span>
                        <div>
                          <p className="font-semibold">{event.description}</p>
                          <p className="text-sm text-gray-600">
                            Date: {new Date(event.timestamp).toLocaleString()}
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

              <div className="flex justify-center mt-6">
                {hasMore && (
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-5000 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={loadMoreEvents}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Load More"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateRandomEvents(
  tokenData: TokenData,
  count: number
): TokenEvent[] {
  const eventTypes = [
    "PRICE_CHANGE",
    "VOLUME_SPIKE",
    "HOLDER_CHANGE",
    "SIGNAL",
  ] as const;
  const impacts = ["HIGH", "MEDIUM", "LOW"] as const;

  const randomEvents: TokenEvent[] = Array.from(
    { length: count },
    (_, index) => {
      const randomType =
        eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const randomImpact = impacts[Math.floor(Math.random() * impacts.length)];
      const hoursAgo = Math.floor(Math.random() * 24 * (index + 1));

      const descriptions = {
        PRICE_CHANGE: [
          "Price increased significantly",
          "Price dropped sharply",
          "Price showing volatility",
        ],
        VOLUME_SPIKE: [
          "Unusual trading volume detected",
          "Trading volume surge",
          "Volume above average",
        ],
        HOLDER_CHANGE: [
          "New whale wallet detected",
          "Major holder reduced position",
          "Significant holder movement",
        ],
        SIGNAL: [
          "Buy signal generated",
          "Sell signal detected",
          "Trading opportunity identified",
        ],
      };

      const values = {
        PRICE_CHANGE: [`${(Math.random() * 30 - 15).toFixed(1)}%`],
        VOLUME_SPIKE: [`${(Math.random() * 5 + 1).toFixed(1)}x average`],
        HOLDER_CHANGE: [`${(Math.random() * 1000000).toFixed(0)} tokens`],
        SIGNAL: ["Strong", "Moderate", "Weak"],
      };

      return {
        id: `additional-${index}-${Date.now()}`,
        type: randomType,
        timestamp: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
        description: descriptions[randomType][Math.floor(Math.random() * 3)],
        value:
          randomType === "HOLDER_CHANGE"
            ? (Math.random() > 0.5 ? "+" : "-") + values[randomType][0]
            : values[randomType][0],
        impact: randomImpact,
      };
    }
  );

  return randomEvents.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}
