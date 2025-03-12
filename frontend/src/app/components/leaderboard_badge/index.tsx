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
        console.error("❌ Error fetching user activity:", error);
      }
    };

    fetchPositionUser();
  }, [isConnected, address]);

  if (!isConnected || !positionUser) return null;

  return (
    <div className="flex flex-wrap items-center bg-white border border-gray-300 rounded-2xl px-4 py-2 shadow-sm gap-4 max-w-full">
      {/* Avatar + Address */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full overflow-hidden">
          <Image
            src={positionUser.avatarSrc}
            alt="avatar"
            width={28}
            height={28}
            className="object-cover"
          />
        </div>
        <span className="text-sm font-semibold text-gray-900 break-all">
          {positionUser.address}
        </span>
      </div>

      {/* Rank */}
      <div className="flex items-center gap-1">
        <Image src="/first-place.svg" alt="rank" width={16} height={16} />
        <span className="text-sm font-medium text-gray-800">
          {positionUser.rank}st
        </span>
      </div>

      {/* Points */}
      <div className="flex items-center gap-1">
        <Image src="/star.svg" alt="points" width={16} height={16} />
        <span className="text-sm font-medium text-gray-800">
          {positionUser.points} pts
        </span>
      </div>
    </div>
  );
};

export default LeaderboardBadge;
