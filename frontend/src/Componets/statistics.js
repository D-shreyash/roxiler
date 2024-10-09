import React, { useEffect, useState } from "react";
import axios from "axios";

const Statistics = ({ month }) => {
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/statistics",
          {
            params: { month },
          }
        );
        setStatistics(response.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, [month]);

  return (
    <div>
      <h3>Statistics for {month.charAt(0).toUpperCase() + month.slice(1)}</h3>
      <p>Total Sale: {statistics.totalSales || 0}</p>
      <p>Total Sold Items: {statistics.soldItems || 0}</p>
      <p>Total Not Sold Items: {statistics.notSoldItems || 0}</p>
    </div>
  );
};

export default Statistics;
