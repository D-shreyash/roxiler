import React, { useState } from "react";
import TransactionsTable from "./Componets/transaction";
import Statistics from "./Componets/statistics";
import BarChart from "./Componets/barchart";

const App = () => {
  const [month, setMonth] = useState("march");

  return (
    <div>
      <h1>Transaction Dashboard</h1>
      <TransactionsTable month={month} setMonth={setMonth} />
      <Statistics month={month} />
      <BarChart month={month} />
    </div>
  );
};

export default App;
