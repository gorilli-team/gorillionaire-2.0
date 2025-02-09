import React from 'react';

interface TweetProps {
  tweet: {
    id: string;
    name: string;
    username: string;
    text: string;
    createdAt: string;
    permanentUrl: string;
  };
}

const timeAgo = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
  }

  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const TweetComponent: React.FC<TweetProps> = ({ tweet }) => {
  return (
    <div className="pt-6 p-2 flex items-start gap-4 w-[600px]">
      <img src="/gorillionaire.jpg" alt="Profile" className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">Gorillionaire</span>
            <span className="text-yellow-500">🦍</span>
          </div>
          <span className="text-xs text-gray-500">{timeAgo(tweet.createdAt)}</span>
        </div>
        <p className="text-gray-700 mt-2">{tweet.text}</p>
        <div className="mt-2 text-sm text-gray-600 flex justify-between">
          <div>
            <p>Username: @{tweet.username}</p>
            <p>Source: {tweet.name}</p>
          </div>
          <a href={tweet.permanentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
            View Tweet
          </a>
        </div>
      </div>
    </div>
  );
};

export default TweetComponent;