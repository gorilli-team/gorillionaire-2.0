"use client";

import { useState } from "react";
import Sidebar from "./components/sidebar/index";
import Header from "./components/header/index";
import Main from "./components/main/index";

export default function AppLayout() {
  const [selectedPage, setSelectedPage] = useState("My Account");

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      <Sidebar selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
      <div className="flex-1 flex flex-col">
        <Header selectedPage={selectedPage} />
        <Main selectedPage={selectedPage} />
      </div>
    </div>
  );
}
