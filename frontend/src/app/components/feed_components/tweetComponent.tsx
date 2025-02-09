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

const formatDate = (dateString: string): string | null => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return null;
  }
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
};

const TweetComponent: React.FC<TweetProps> = ({ tweet }) => {
  const formattedDate = formatDate(tweet.createdAt);

  return (
    <div className="pt-6 p-2 flex items-start gap-4 w-[600px]">
      <img src="/gorillionaire.jpg" alt="Profile" className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">Gorillionaire</span>
            <span className="text-yellow-500">🦍</span>
          </div>
          {formattedDate && <span className="text-xs text-gray-500">{formattedDate}</span>}
        </div>
        <div className='cursor-pointer bg-white shadow-md mt-4 rounded-2xl p-4 mx-auto flex-col justify-center text-[14px]'>
          <p className="text-gray-800 font-medium text-base mb-3">{tweet.text}</p>
          <div className="mt-2 text-gray-600 flex justify-between items-center">
            <div>
              <p className="text-blue-500 font-semibold">@{tweet.username}</p>
              <p className="text-xs text-gray-500">Source: {tweet.name}</p>
            </div>
            <a href={tweet.permanentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium">
              View Tweet
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetComponent;