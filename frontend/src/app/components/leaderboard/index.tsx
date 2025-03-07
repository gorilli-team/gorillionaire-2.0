"use client";

import React from "react";

const Leaderboard = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-8 max-w-2xl text-center shadow-lg">
            <h2 className="text-3xl font-bold text-purple-800 mb-6">
              🤖 Leaderboard
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
