import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const CustomBarChart = ({ data, xKey = 'category', height = 300 }) => {
  if (!data || data.length === 0)
    return <p className="text-gray-400 text-center mt-4">No data to display</p>;

  const getBarColor = (index) => (index % 2 === 0 ? '#875CF5' : '#cfbefb');

  const CustomTooltipContent = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
          {item.source && <p className="text-xs font-semibold text-purple-800 mb-1">{item.source}</p>}
          {item.category && <p className="text-xs font-semibold text-purple-800 mb-1">{item.category}</p>}
          <p className="text-sm text-gray-600">
            {item.month && <>Date: {item.month} | </>} 
            Amount: <span className="font-medium">${item.amount}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white mt-6" style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: '#555' }} />
          <YAxis tick={{ fontSize: 12, fill: '#555' }} />
          <Tooltip content={<CustomTooltipContent />} />
          <Bar dataKey="amount" radius={[10, 10, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
