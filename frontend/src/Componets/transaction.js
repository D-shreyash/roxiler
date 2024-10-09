import React, { useEffect, useState } from "react";
import axios from "axios";

const TransactionsTable = ({ month, setMonth }) => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const fetchTransactions = async (page = 1) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/transactions",
        {
          params: { month, search, page, perPage: itemsPerPage },
        }
      );
      setTransactions(response.data.data);
      setTotalItems(response.data.total);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [month, search, currentPage]);

  const handleMonthChange = (e) => {
    setMonth(e.target.value); // Use setMonth from props
    setCurrentPage(1); // Reset to the first page
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to the first page
  };

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < totalItems) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div>
      <select value={month} onChange={handleMonthChange}>
        {[
          "january",
          "february",
          "march",
          "april",
          "may",
          "june",
          "july",
          "august",
          "september",
          "october",
          "november",
          "december",
        ].map((m) => (
          <option key={m} value={m}>
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Search transactions..."
        value={search}
        onChange={handleSearchChange}
      />

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date of Sale</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handlePreviousPage} disabled={currentPage === 1}>
        Previous
      </button>
      <button
        onClick={handleNextPage}
        disabled={currentPage * itemsPerPage >= totalItems}
      >
        Next
      </button>
    </div>
  );
};

export default TransactionsTable;
