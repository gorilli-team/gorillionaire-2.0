"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Header from "@/app/components/header";
import SignalsComponent from "@/app/components/signals";

const SignalsPage = () => {
  const [selectedPage, setSelectedPage] = useState("Signals");

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      <Sidebar selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
      <div className="flex-1 flex flex-col">
        <Header />
        <SignalsComponent />
      </div>
    </div>
  );
};

export default SignalsPage;
