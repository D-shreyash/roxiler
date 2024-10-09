import React, { useEffect, useState } from "react";
import axios from "axios";

const SvgBarChart = ({ month }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        console.log(`Fetching data for month: ${month}`); // Debugging
        const response = await axios.get("http://localhost:3000/api/BarChart", {
          params: { month },
        });
        console.log("Fetched data:", response.data); // Debugging
        setChartData(response.data);
      } catch (error) {
        console.error("Error fetching bar chart data:", error);
      }
    };

    fetchBarChartData();
  }, [month]);

  // If no data is available, return early
  if (!chartData.length) {
    return <div>No data available for the selected month.</div>;
  }

  const maxCount = Math.max(...chartData.map((item) => item.count));

  return (
    <svg width={600} height={300}>
      {chartData.map((item, index) => (
        <rect
          key={item.range}
          x={index * 60 + 50}
          y={300 - (item.count / maxCount) * 250}
          width={40}
          height={(item.count / maxCount) * 250}
          fill="#4caf50"
        />
      ))}
      <g>
        {chartData.map((item, index) => (
          <text
            key={item.range}
            x={index * 60 + 50}
            y={300 - (item.count / maxCount) * 250 - 5}
            textAnchor="middle"
            fill="#000"
          >
            {item.count}
          </text>
        ))}
      </g>
    </svg>
  );
};

export default SvgBarChart;
