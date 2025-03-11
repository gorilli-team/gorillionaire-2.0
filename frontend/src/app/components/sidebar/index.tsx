import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SidebarProps {
  selectedPage: string;
  setSelectedPage: React.Dispatch<React.SetStateAction<string>>;
}

export default function Sidebar({
  selectedPage,
  setSelectedPage,
}: SidebarProps) {
  const router = useRouter();

  const handleGorillionaireClick = () => {
    router.push("https://gorillionai.re");
  };

  const handlePageChange = (page: string) => {
    setSelectedPage(page);
    router.push(`/${page.toLowerCase()}`);
  };

  return (
    <aside className="w-64 text-gray-800 flex flex-col bg-white h-screen sticky top-0 border-r border-gray-200 overflow-hidden">
      <div
        className="h-16 text-xl font-bold flex items-center ps-6 lg:ps-6 cursor-pointer"
        onClick={handleGorillionaireClick}
      >
        <Image
          src="/logolight.svg"
          alt="logo-gorillionaire"
          width={180}
          height={180}
          className="rounded-full ml-[40px] lg:ml-0" // Added 40px margin left only on mobile
        />
      </div>
      <nav className="flex-1 p-4 overflow-hidden">
        <ul className="space-y-2">
          <li>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200 ${
                selectedPage === "Signals" ? "bg-gray-200" : ""
              }`}
              onClick={() => handlePageChange("Signals")}
            >
              <i className="fa-solid fa-signal pr-2"></i>
              <span>Signals</span>
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200 ${
                selectedPage === "Tokens" ? "bg-gray-200" : ""
              }`}
              onClick={() => handlePageChange("Tokens")}
            >
              <i className="fa-solid fa-coins pr-2"></i>
              <span>Tokens</span>
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200 ${
                selectedPage === "Agents" ? "bg-gray-200" : ""
              }`}
              onClick={() => handlePageChange("Agents")}
            >
              <i className="fa-solid fa-robot pr-2"></i>
              <span>Agents</span>
            </button>
          </li>

          <li>
            <button
              className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200 ${
                selectedPage === "Trades" ? "bg-gray-200" : ""
              }`}
              onClick={() => handlePageChange("Trades")}
            >
              <i className="fa-solid fa-money-bill-transfer pr-2"></i>
              <span>Trades</span>
            </button>
          </li>

          <>
            <li>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200 ${
                  selectedPage === "Leaderboard" ? "bg-gray-200" : ""
                }`}
                onClick={() => handlePageChange("Leaderboard")}
              >
                <i className="fa-solid fa-star pr-2"></i>
                <span>Leaderboard</span>
              </button>
            </li>
          </>
        </ul>
      </nav>
      
      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="space-y-3">
          <a 
            href="https://github.com/gorilli-team/gorillionaire" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-200 text-gray-600"
          >
          <Image
            src="/github.svg"
            alt="Github"
            width={30}
            height={30}
          />
          </a>
          
          <a 
            href="https://x.com/gorillionaireAI" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-200 text-gray-600"
          >
          <Image
            src="/twitter.svg"
            alt="twitter"
            width={30}
            height={30}
          />
          </a>
        </div>
        
        <div className="flex items-center justify-center mt-4 text-xs text-gray-500">
          <span className="mr-2">Powered by</span>
          <Image
            src="/Vector.svg"
            alt="Gorilli"
            width={60}
            height={60}
          />
        </div>
      </div>
    </aside>
  );
}