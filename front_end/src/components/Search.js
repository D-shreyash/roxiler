import React from "react";

const Search = ({ search, setSearch, month, setMonth }) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row justify-center gap-4 ">
      <input
        type="text"
        className="p-3 w-full md:w-1/3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
        placeholder="Search ..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        className="p-3 w-full md:w-1/4 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      >
        <option value="01">January</option>
        <option value="02">February</option>
        <option value="03">March</option>
        <option value="04">April</option>
        <option value="05">May</option>
        <option value="06">June</option>
        <option value="07">July</option>
        <option value="08">August</option>
        <option value="09">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>
    </div>
  );
};

export default Search;
