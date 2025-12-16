import React from 'react';

const CustomLegend = ({ payload = [] }) => {
  return (
    <div className="flex flex-wrap justify-center gap-6 mt-4">
      {payload.map((entry, index) => (
        <div
          key={`legend-${index}`}
          className="flex items-center space-x-2"
        >
          {/* Color dot */}
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />

          {/* Label */}
          <span className="text-sm text-gray-700">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CustomLegend;
