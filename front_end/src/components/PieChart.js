import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register the required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ pieData }) => {
  // Prepare the chart data from the received `pieData`
  const data = {
    labels: pieData.map((item) => item._id), // Extracting the category names (e.g., electronics, clothing)
    datasets: [
      {
        data: pieData.map((item) => item.count), // Extracting the count of items in each category
        backgroundColor: [
          "#14B8A6",
          "#33FF57",
          "#3357FF",
          "#FF33A8",
          "#FF9133",
          "#33FFF5",
          "#FF8A33",
          "#9333FF",
          "#33FF99",
        ], // You can modify the color scheme as per your design
        hoverOffset: 4, // Effect when hovering over the chart
      },
    ],
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-100 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Sales Distribution by Category
      </h2>
      <div className="flex justify-center">
        <Pie data={data} />
      </div>
    </div>
  );
};

export default PieChart;
