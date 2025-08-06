import React from 'react';

const SalesCountCircle: React.FC = () => {
  const totalSales = 100;
  const currentSales = 75; // You can dynamically set this
  const percentage = Math.round((currentSales / totalSales) * 100);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white w-full max-w-sm flex flex-col items-center">
      <h2 className="text-lg font-semibold text-green-700 mb-4">Sales Progress</h2>
      <svg width="120" height="120" className="mb-4">
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#e5e7eb" // gray-200
          fill="none"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="#10b981" // green-500
          fill="none"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
        <text
          x="60"
          y="65"
          textAnchor="middle"
          fontSize="20"
          fontWeight="bold"
          fill="#10b981"
        >
          {percentage}%
        </text>
      </svg>
      <div className="text-sm text-gray-600">
        {currentSales} of {totalSales} sales completed
      </div>
    </div>
  );
};

export default SalesCountCircle;