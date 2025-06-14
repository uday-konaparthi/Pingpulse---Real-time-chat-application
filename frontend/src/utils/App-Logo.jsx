import React from 'react';

const PingPulseLogo = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 300 100"
    className="w-32 h-10 text-indigo-600"
    fill="none"
    {...props}
  >
    {/* Chat bubble outline */}
    <path
      d="M10,10 h120 v60 h-20 l-20,20 v-20 h-80 z"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
    />
    {/* Pulse/wave inside bubble */}
    <path
      d="M20,45 L28,45 L30,35 L35,55 L40,45 L48,45 L50,30 L55,50 L60,45 L110,45"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
    />
    {/* Brand name text */}
    <text
      x="150"
      y="50"
      fill="currentColor"
      fontFamily="sans-serif"
      fontSize="24"
      fontWeight="bold"
      textAnchor="start"
      dominantBaseline="middle"
    >
      PingPulse
    </text>
  </svg>
);

export default PingPulseLogo;
