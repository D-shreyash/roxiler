const axios = require("axios");
const inventory = require("../model/inventory");
const { model } = require("mongoose");

exports.getData = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );

    const new_data = data.map((item) => ({
      ...item,
      dateOfSale: new Date(item.dateOfSale),
    }));

    await inventory.deleteMany({});
    await inventory.insertMany(new_data);
    res.status(200).json({ message: "Database initialized successfully." });
  } catch (error) {
    console.log("error in contoler", error);
    res.status(500).json({ message: "Error initializing database", error });
  }
};

exports.listTransation = async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const monthNumber = parseInt(req.query.month, 10) || 1;

    const query = {
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { price: isNaN(search) ? -1 : Number(search) },
      ],
    };

    const transactions = await inventory
      .find(query)
      .skip((page - 1) * perPage)
      .limit(Number(perPage));

    const totalCount = await inventory.countDocuments(query);

    res.status(200).json({ transactions, totalCount });
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
};

// - Total sale amount of selected month
// - Total number of sold items of selected month
// - Total number of not sold items of selected month

exports.getStistics = async (req, res) => {
  try {
    const monthNumber = parseInt(req.query.month, 10) || 1;

    const totalSales = await inventory.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] }, // Match month only
          sold: true,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$price" },
        },
      },
    ]);

    const soldCount = await inventory.countDocuments({
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
      sold: true,
    });

    const notSoldCount = await inventory.countDocuments({
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
      sold: false,
    });

    res.status(200).json({
      totalSales: totalSales[0]?.totalAmount || 0,
      soldCount,
      notSoldCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching statistics", error });
  }
};

exports.getBarChart = async (req, res) => {
  const { month } = req.query;

  try {
    const monthNumber = parseInt(month, 10) || 1;
    const priceRanges = await inventory.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] }, // Match month only
        },
      },
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [
            0,
            100,
            200,
            300,
            400,
            500,
            600,
            700,
            800,
            900,
            Infinity,
          ],
          default: "Other",
          output: { count: { $sum: 1 } },
        },
      },
    ]);

    res.status(200).json(priceRanges);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bar chart data", error });
  }
};

exports.getPieChart = async (req, res) => {
  const { month } = req.query;

  try {
    const monthNumber = parseInt(month, 10) || 1;
    const categories = await inventory.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] }, // Match month only
        },
      },
      {
        $group: { _id: "$category", count: { $sum: 1 } },
      },
    ]);

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pie chart data", error });
  }
};

exports.getCombinedData = async (req, res) => {
  const { month } = req.query;

  try {
    const monthNumber = parseInt(month, 10) || 1;

    // Get transactions for the month
    const transactions = await inventory.find({
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
    });

    // Get statistics
    const totalSales = await inventory.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
          sold: true,
        },
      },
      {
        $group: { _id: null, totalAmount: { $sum: "$price" } },
      },
    ]);

    const soldCount = await inventory.countDocuments({
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
      sold: true,
    });

    const notSoldCount = await inventory.countDocuments({
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
      sold: false,
    });

    // Get bar chart data
    const priceRanges = await inventory.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
        },
      },
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [
            0,
            100,
            200,
            300,
            400,
            500,
            600,
            700,
            800,
            900,
            Infinity,
          ],
          default: "Other",
          output: { count: { $sum: 1 } },
        },
      },
    ]);

    // Get pie chart data
    const categories = await inventory.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
        },
      },
      {
        $group: { _id: "$category", count: { $sum: 1 } },
      },
    ]);

    // Combine all data
    res.status(200).json({
      transactions,
      statistics: {
        totalSales: totalSales[0]?.totalAmount || 0,
        soldCount,
        notSoldCount,
      },
      barChart: priceRanges,
      pieChart: categories,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching combined data", error });
  }
};
