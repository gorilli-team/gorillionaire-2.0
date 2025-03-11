"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const LeaderboardBadge: React.FC = () => {
  const [topUser, setTopUser] = useState({
    points: 85,
    address: "0x5b2e...c6a57",
    avatarSrc: "/avatar_1.png",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTopUser = async () => {
      setIsLoading(true);
      try {
        // Placeholder fetch logic here
      } catch (error) {
        console.error("Error fetching top user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopUser();
  }, []);

  if (isLoading) {
    return (
      <div className="h-12 w-full max-w-md bg-gray-200 animate-pulse rounded-lg" />
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-1 shadow-sm">
        <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
          <Image
            src={topUser.avatarSrc}
            alt="avatar"
            width={24}
            height={24}
            className="object-cover"
          />
        </div>
        <span className="text-sm font-semibold text-gray-900">
          {topUser.address}
        </span>
      </div>

      {/* Rank pill */}
      <div className="flex items-center bg-white border border-gray-300 rounded-full px-3 py-1 shadow-sm">
        <Image
          src="/first-place.svg"
          alt="rank"
          width={16}
          height={16}
          className="mr-1"
        />
        <span className="text-sm font-medium text-gray-800">1st</span>
      </div>

      {/* Points pill */}
      <div className="flex items-center bg-white border border-gray-300 rounded-full px-3 py-1 shadow-sm">
        <Image
          src="/star.svg"
          alt="points"
          width={16}
          height={16}
          className="mr-1"
        />
        <span className="text-sm font-medium text-gray-800">
          {topUser.points} points
        </span>
      </div>
    </div>
  );
};

export default LeaderboardBadge;
