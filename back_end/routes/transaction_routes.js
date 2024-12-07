const express = require("express");
const router = express.Router();
const transactions = require("../controlers/transaction_controler");

router.get("/getData", transactions.getData);
router.get("/listTransation", transactions.listTransation);
router.get("/getStistics", transactions.getStistics);
router.get("/getBarChart", transactions.getBarChart);
router.get("/getPieChart", transactions.getPieChart);
router.get("/getCombinedData", transactions.getCombinedData);

module.exports = router;
