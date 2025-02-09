import React from "react";
import { useAccount } from "wagmi";

interface SidebarProps {
  selectedPage: string;
  setSelectedPage: React.Dispatch<React.SetStateAction<string>>;
  setSelectedVault: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function Sidebar({
  selectedPage,
  setSelectedPage,
  setSelectedVault,
}: SidebarProps) {
  const { address } = useAccount();

  const handleGorillionaireClick = () => {
    window.location.reload();
  };

  const handlePageChange = (page: string) => {
    setSelectedPage(page);
    setSelectedVault(null);
  };

  return (
    <aside className="w-64 text-gray-800 flex flex-col border border-gray-300">
      <div
        className="h-16 text-xl font-bold flex items-center ps-4 cursor-pointer"
        onClick={handleGorillionaireClick}
      >
        <img className="w-12 h-12 rounded-full" src="/gorillionaire.jpg" alt="logo-gorillionaire" />
        <span className="ps-2">Gorillionaire</span>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200 ${
                selectedPage === "Feed" ? "bg-gray-200" : ""
              }`}
              onClick={() => handlePageChange("Feed")}
            >
              <i className="fa-regular fa-newspaper pr-2"></i>
              <span>Feed</span>
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200 ${
                selectedPage === "Vault" ? "bg-gray-200" : ""
              }`}
              onClick={() => handlePageChange("Vault")}
            >
              <i className="fa-solid fa-shield pr-2"></i>
              <span>Vault</span>
            </button>
          </li>
          
          {address && (
            <>
              <li>
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200 ${
                    selectedPage === "TestTrading" ? "bg-gray-200" : ""
                  }`}
                  onClick={() => handlePageChange("TestTrading")}
                >
                  <i className="fa-solid fa-chart-line pr-2"></i>
                  <span>Test trading</span>
                </button>
              </li>
              <li>
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200 ${
                    selectedPage === "My Account" ? "bg-gray-200" : ""
                  }`}
                  onClick={() => handlePageChange("My Account")}
                >
                  <i className="fa-solid fa-circle-user pr-2"></i>
                  <span>My account</span>
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
}