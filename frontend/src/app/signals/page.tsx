"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Header from "@/app/components/header";
import SignalsComponent from "@/app/components/signals";

const SignalsPage = () => {
  const [selectedPage, setSelectedPage] = useState("Signals");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Mobile menu button - positioned differently to avoid overlap */}
      <button
        className="lg:hidden fixed top-3 left-3 z-40 p-2 rounded-full bg-white shadow-md border border-gray-200"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg
          className="w-5 h-5" // Made the icon smaller
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              isMobileMenuOpen
                ? "M6 18L18 6M6 6l12 12"
                : "M4 6h16M4 12h16M4 18h16"
            }
          />
        </svg>
      </button>

      {/* Sidebar - ensure full height and proper display on all screens */}
      <div
        className={`
        fixed lg:static
        h-screen min-h-screen
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
        transition-transform duration-300 ease-in-out
        z-30 lg:z-0
        bg-white
        shadow-xl lg:shadow-none
        lg:flex lg:flex-col
      `}
      >
        <Sidebar
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col">
        <Header />
        <SignalsComponent />
      </div>
    </div>
  );
};

export default SignalsPage;