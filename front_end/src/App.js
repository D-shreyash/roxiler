import { useEffect, useState } from "react";
import "./App.css";
import Statestics from "./components/Statestics";
import axios from "axios";
import Barchart from "./components/Barchart";
import PieChart from "./components/PieChart";
import TransactionTable from "./components/TransactionTable";
import Search from "./components/Search";

function App() {
  const [statesticsData, setStatesticsData] = useState(null);
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("10");
  const [page, setPage] = useState(1);
  // const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [transactions, setTransactions] = useState([]);
  const [barChart, setBarChart] = useState([]);
  const [pieChart, setPieChart] = useState([]);
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data: statisticsResponse } = await axios.get(
          `https://roxiler-fc1t.onrender.com/transactions/getStistics?month=${month}`
        );
        setStatesticsData(statisticsResponse);

        const { data: transactionsResponse } = await axios.get(
          `https://roxiler-fc1t.onrender.com/listTransation?month=${month}&search=${search}&page=${page}&perPage=${perPage}`
        );

        setTransactions(transactionsResponse.transactions);
        // setTotalCount(transactionsResponse.totalCount);

        const { data: barChartResponse } = await axios.get(
          `https://roxiler-fc1t.onrender.com/getBarChart?month=${month}`
        );
        setBarChart(barChartResponse);

        const { data: pieChartResponse } = await axios.get(
          `https://roxiler-fc1t.onrender.com/getPieChart?month=${month}`
        );
        setPieChart(pieChartResponse);

        console.log("home", statisticsResponse);
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(true);
      }
    };
    setPage(1);
    // setTotalCount(100);
    setPerPage(10);
    getData();
  }, [month, search, page, perPage]);

  return (
    <div className="App bg-gradient-to-r bg-gray-100">
      {/* Header Section */}
      <header className="mb-8 text-black py-6 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-lg font-medium">
            Dive into insights, track performance, and visualize your data
            effectively.
          </p>
        </div>
      </header>

      {/* Search and Filter Section */}
      <div className="m-8">
        <Search
          search={search}
          setSearch={setSearch}
          month={month}
          setMonth={setMonth}
        />
      </div>
      {!Loading ? (
        <div className="text-center text-3xl text-gray-500">Loading...</div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6">
          {/* Statistics Section */}
          <section className="mb-10">
            <Statestics statistics={statesticsData} />
          </section>

          {/* Transactions Section */}
          <section className="mb-10">
            <TransactionTable transactions={transactions} />
          </section>

          {/* Charts Section */}
          <section className="flex flex-wrap gap-6 justify-center">
            {/* Bar Chart */}
            <div className="w-full md:w-[48%] lg:w-[45%] bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center border-b pb-2">
                Sales by Price Range
              </h3>
              <Barchart barChartData={barChart} />
            </div>

            {/* Pie Chart */}
            <div className="w-full md:w-[48%] lg:w-[45%] bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center border-b pb-2">
                Sales by Category
              </h3>
              <PieChart pieData={pieChart} />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
