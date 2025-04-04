
import React from 'react';

const WiFiHeader = () => {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="h-24 w-24 flex items-center justify-center rounded-full bg-primary/10 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          <path d="M5 13a10 10 0 0 1 14 0" />
          <path d="M8.5 16.5a5 5 0 0 1 7 0" />
          <circle cx="12" cy="20" r="1" />
        </svg>
      </div>
      <h1 className="text-2xl font-semibold mb-1">WiFi Whisperer</h1>
      <p className="text-muted-foreground text-center max-w-md">
        Connect to wireless networks without additional software
      </p>
    </div>
  );
};

export default WiFiHeader;
