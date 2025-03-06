"use client";

import React from "react";

const Signals = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50 pt-16 lg:pt-0">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Tab Navigation - Further mobile optimization */}
        <div className="mb-4 sm:mb-6 -mx-2 sm:mx-0">
          <div className="border-b border-gray-200">
            <nav
              className="flex overflow-x-auto hide-scrollbar"
              aria-label="Tabs"
            ></nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signals;
