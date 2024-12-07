const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const transactions_route = require("./routes/transaction_routes");
const cors = require("cors");
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/transactions", transactions_route);

mongoose
  .connect(process.env.MONOG_DB_URI)
  .then(() => {
    console.log("connected to mongoDb");
  })
  .catch((err) => {
    console.log("error in connection with DB", err);
  });

app.listen(3001, () => {
  console.log("server started");
});
