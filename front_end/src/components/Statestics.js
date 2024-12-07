import React from "react";

const Statistics = ({ statistics }) => {
  return (
    <div className="p-8 max-w-4xl mx-auto bg-gray-100 rounded-xl ">
      <h2 className="text-3xl font-bold text-center text-indigo-800 mb-8">
        Monthly Statistics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <div className="bg-gradient-to-r from-teal-400 to-teal-500 p-6 rounded-lg shadow-xl">
          <h3 className="text-xl font-semibold text-white">Total Sales</h3>
          <p className="text-3xl font-bold text-white mt-4">
            ${statistics.totalSales}
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-400 to-green-500 p-6 rounded-lg shadow-xl">
          <h3 className="text-xl font-semibold text-white">Sold Items</h3>
          <p className="text-3xl font-bold text-white mt-4">
            {statistics.soldCount}
          </p>
        </div>

        <div className="bg-gradient-to-r from-red-400 to-red-500 p-6 rounded-lg shadow-xl">
          <h3 className="text-xl font-semibold text-white">Not Sold Items</h3>
          <p className="text-3xl font-bold text-white mt-4">
            {statistics.notSoldCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
