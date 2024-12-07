import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ barChartData }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (barChartData) {
      // Prepare data for the bar chart
      const formattedData = {
        labels: barChartData.map((item) => item._id),
        datasets: [
          {
            label: "Number of Items",
            data: barChartData.map((item) => item.count),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      };
      setChartData(formattedData);
    }
  }, [barChartData]);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-100 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Sales by Price Range
      </h2>
      <div className="w-full h-80">
        {chartData ? (
          <Bar data={chartData} options={{ responsive: true }} />
        ) : (
          <p>Loading chart...</p>
        )}
      </div>
    </div>
  );
};

export default BarChart;
