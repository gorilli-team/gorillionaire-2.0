import React from "react";

interface FeedNewsProps {
  imageUrl: string;
  
  timestamp: string | Date;
  content: string;
  vaultName: string;
}

const timeAgo = (timestamp: string | Date) => {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
  }

  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const FeedNews: React.FC<FeedNewsProps> = ({ imageUrl, timestamp, content, vaultName }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 flex items-start gap-4 w-full">
      <img src={imageUrl} alt="Profile" className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-800">Gorillionaire</span>
          <span className="text-xs text-gray-500">{timeAgo(timestamp)}</span>
        </div>
        <p className="text-gray-700 mt-1">{content}</p>
        <div className="mt-2 text-blue-500 font-medium">{vaultName}</div>
      </div>
    </div>
  );
};

export default FeedNews;
