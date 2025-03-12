"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";

const LeaderboardBadge: React.FC = () => {
  const { address, isConnected } = useAccount();

  const [positionUser, setPositionUser] = useState<{
    points: number;
    address: string;
    avatarSrc: string;
    rank: string;
  } | null>(null);

  useEffect(() => {
    if (!isConnected || !address) return;

    const fetchPositionUser = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/activity/track/me?address=${address}`
        );
        const data = await response.json();

        setPositionUser({
          points: data.userActivity?.points || 0,
          address: data.userActivity?.address || address,
          avatarSrc: "/avatar_1.png",
          rank: data.userActivity?.rank,
        });
      } catch (error) {
        console.error("❌ Errore nel fetch utente:", error);
      }
    };

    fetchPositionUser();
  }, [isConnected, address]);

  if (!isConnected || !positionUser) return null;

  return (
    <div className="flex items-center gap-3">
      {/* Avatar + Address pill */}
      <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-1 shadow-sm">
        <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
          <Image
            src={positionUser.avatarSrc}
            alt="avatar"
            width={24}
            height={24}
            className="object-cover"
          />
        </div>
        <span className="text-sm font-semibold text-gray-900">
          {positionUser.address}
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
        <span className="text-sm font-medium text-gray-800">{positionUser.rank}st</span>
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
          {positionUser.points} points
        </span>
      </div>
    </div>
  );
};

export default LeaderboardBadge;

