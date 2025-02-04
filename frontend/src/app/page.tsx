"use client";

import { useState } from "react";
import Sidebar from "./components/sidebar/index";
import Header from "./components/header/index";
import Main from "./components/main/index";

export default function AppLayout() {
  const [selectedPage, setSelectedPage] = useState("Feed");
  const [selectedVault, setSelectedVault] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      <Sidebar selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
      <div className="flex-1 flex flex-col">
        <Header />
        <Main selectedPage={selectedPage} selectedVault={selectedVault} setSelectedVault={setSelectedVault} />
      </div>
    </div>
  );
}
