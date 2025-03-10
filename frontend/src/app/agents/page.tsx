"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/sidebar";
import Header from "@/app/components/header";
import AgentsComponent from "@/app/components/agents";

const AgentsPage = () => {
  const [selectedPage, setSelectedPage] = useState("Agents");

  return (
    <div className="flex min-h-screen h-screen bg-gray-100 text-gray-800 overflow-hidden">
      <div className="h-screen">
        <Sidebar selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
      </div>
      <div className="flex-1 flex flex-col overflow-auto">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <AgentsComponent />
        </main>
      </div>
    </div>
  );
};

export default AgentsPage;