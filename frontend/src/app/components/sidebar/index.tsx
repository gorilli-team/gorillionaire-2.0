import React from "react";

interface SidebarProps {
  selectedPage: string;
  setSelectedPage: React.Dispatch<React.SetStateAction<string>>;
}

export default function Sidebar({ selectedPage, setSelectedPage }: SidebarProps) {
  const handleGorillionaireClick = () => {
    window.location.reload();
  };

  return (
    <aside className="w-64 text-gray-800 flex flex-col border border-gray-300">
      <div
        className="h-16 text-xl font-bold flex items-center border-b border-gray-300 ps-4 cursor-pointer"
        onClick={handleGorillionaireClick}
      >
        <span>Gorillionaire</span>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200 ${selectedPage === "My Account" ? "bg-gray-200" : ""}`}
              onClick={() => setSelectedPage("My Account")}
            >
              My Account
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200 ${selectedPage === "Vaults" ? "bg-gray-200" : ""}`}
              onClick={() => setSelectedPage("Vaults")}
            >
              Vaults
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
