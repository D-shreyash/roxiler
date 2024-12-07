function TransactionTable({ transactions }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg ">
      <h2 className="text-2xl text-center font-semibold text-gray-800 mb-4">
        Transactions
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse table-auto">
          <thead>
            <tr className="text-left text-sm font-medium text-gray-600 border-b">
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Sold</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b">
                <td className="px-4 py-2">{transaction.title}</td>
                <td className="px-4 py-2">${transaction.price}</td>
                <td className="px-4 py-2">{transaction.sold ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionTable;
