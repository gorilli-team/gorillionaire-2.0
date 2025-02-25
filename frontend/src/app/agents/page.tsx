"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Header from "@/app/components/header";
import AgentsComponent from "@/app/components/agents";

const AgentsPage = () => {
  const [selectedPage, setSelectedPage] = useState("Agents");

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      <Sidebar selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
      <div className="flex-1 flex flex-col">
        <Header />
        <AgentsComponent />
      </div>
    </div>
  );
};

export default AgentsPage;
