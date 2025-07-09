// components/SafeBarChart.tsx
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", rides: 3 },
  { day: "Tue", rides: 5 },
  { day: "Wed", rides: 2 },
  { day: "Thu", rides: 4 },
  { day: "Fri", rides: 6 },
  { day: "Sat", rides: 8 },
  { day: "Sun", rides: 4 },
];

const SafeBarChart = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div className="text-gray-500">Loading chart...</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="day" stroke="#8884d8" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="rides" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SafeBarChart;
