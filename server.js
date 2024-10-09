const express = require("express");
const sequelize = require("./config");
const Sequelize = require("sequelize");
const { Op, fn, literal, col } = require("sequelize");
const Product = require("./models/Product");
const seed = require("./seed");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;

const startserver = async () => {
  try {
    // Authenticate to the database
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    const count = await Product.count();
    console.log("Current product count:", count);

    if (count === 0) {
      console.log("No products found in the database. Seeding...");
      await seed();
    } else {
      console.log("Products already exist. Skipping seeding.");
    }

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error syncing database:", err);
  }
};

app.get("/api/products", async (req, res) => {
  try {
    sequelize.sync();
    const products = await Product.findAll({
      limit: 5,
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/transactions", async (req, res) => {
  try {
    const { month, search = "", page = 1, perPage = 10 } = req.query;

    const monthMap = {
      january: 1,
      february: 2,
      march: 3,
      april: 4,
      may: 5,
      june: 6,
      july: 7,
      august: 8,
      september: 9,
      october: 10,
      november: 11,
      december: 12,
    };

    const monthNumber = monthMap[month];

    // Set pagination limits
    const limit = parseInt(perPage, 10) || 10;
    const offset = (parseInt(page, 10) - 1) * limit;

    // Build the search condition
    const searchCondition = search
      ? {
          [Op.or]: [
            { title: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } },
            { price: { [Op.eq]: parseFloat(search) } },
          ],
        }
      : {};

    // Build the date condition for the month
    const dateCondition = monthNumber
      ? {
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn(
                "EXTRACT",
                Sequelize.literal('MONTH FROM "dateOfSale"')
              ),
              monthNumber
            ),
          ],
        }
      : {};

    // Fetch products with pagination and filtering
    const { rows: products, count } = await Product.findAndCountAll({
      where: {
        ...searchCondition,
        ...dateCondition,
      },
      limit,
      offset,
    });

    // Response with data, total count, and pagination info
    res.status(200).json({
      data: products,
      total: count,
      page: parseInt(page, 10),
      perPage: limit,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create an API for statistics
// - Total sale amount of selected month
// - Total number of sold items of selected month
// - Total number of not sold items of selected month

app.get("/api/statistics", async (req, res) => {
  try {
    const { month } = req.query;

    // Validate if the month is present
    if (!month) {
      return res.status(400).json({ message: "Month parameter is required" });
    }

    const validMonths = [
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
    ];

    // Check if the provided month is valid
    if (!validMonths.includes(month.toLowerCase())) {
      return res.status(400).json({ message: "Invalid month" });
    }

    // Get month index (1-based for SQL queries)
    const monthIndex = validMonths.indexOf(month.toLowerCase()) + 1;

    // Get total sale amount for sold items within the given month
    const totalSale = await Product.sum("price", {
      where: {
        sold: true,
        dateOfSale: Sequelize.where(
          Sequelize.fn("EXTRACT", Sequelize.literal('MONTH FROM "dateOfSale"')),
          monthIndex
        ),
      },
    });

    // Get count of sold items in the specified month
    const soldItems = await Product.count({
      where: {
        sold: true,
        dateOfSale: Sequelize.where(
          Sequelize.fn("EXTRACT", Sequelize.literal('MONTH FROM "dateOfSale"')),
          monthIndex
        ),
      },
    });

    // Get count of unsold items in the specified month
    const notSoldItems = await Product.count({
      where: {
        sold: false,
        dateOfSale: Sequelize.where(
          Sequelize.fn("EXTRACT", Sequelize.literal('MONTH FROM "dateOfSale"')),
          monthIndex
        ),
      },
    });

    // Return statistics with default values if counts are null
    res.status(200).json({
      totalSales: totalSale || 0,
      soldItems: soldItems || 0,
      notSoldItems: notSoldItems || 0,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// API for bar chart

// GET
// Create an API for bar chart ( the response should contain price range and the number
// of items in that range for the selected month regardless of the year )
// - 0 - 100
// - 101 - 200
// - 201-300
// - 301-400
// - 401-500
// - 501 - 600
// - 601-700
// - 701-800
// - 801-900
// - 901-above

app.get("/api/BarChart", async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: "Month parameter is required" });
    }

    const validMonths = [
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
    ];

    if (!validMonths.includes(month.toLowerCase())) {
      return res.status(400).json({ message: "Invalid month" });
    }

    const monthIndex = validMonths.indexOf(month.toLowerCase()) + 1; // Adjusting for 1-based index

    const priceRanges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Infinity },
    ];

    const result = await Promise.all(
      priceRanges.map(async (range) => {
        const count = await Product.count({
          where: {
            price: {
              [Op.gte]: range.min,
              [Op.lte]: range.max,
            },
            dateOfSale: Sequelize.where(
              Sequelize.fn(
                "EXTRACT",
                Sequelize.literal('MONTH FROM "dateOfSale"')
              ),
              monthIndex
            ),
          },
        });

        return {
          range: `${range.min}-${range.max === Infinity ? "above" : range.max}`,
          count,
        };
      })
    );

    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET
// Create an API for pie chart Find unique categories and number of items from that
// category for the selected month regardless of the year.
// For example :
// - X category : 20 (items)
// - Y category : 5 (items)
// - Z category : 3 (items)

app.get("/api/piechart", async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: "Month parameter is required" });
    }

    const validMonths = [
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
    ];

    if (!validMonths.includes(month.toLowerCase())) {
      return res.status(400).json({ message: "Invalid month" });
    }

    const monthIndex = validMonths.indexOf(month.toLowerCase()) + 1; // Replace with the desired month index (1 for January, 2 for February, etc.)

    console.log("month is ", monthIndex);
    const result = await Product.findAll({
      attributes: ["category", [fn("COUNT", col("id")), "itemCount"]],
      where: Sequelize.where(
        Sequelize.fn("EXTRACT", Sequelize.literal('MONTH FROM "dateOfSale"')),
        monthIndex
      ),
      group: ["category"],
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching pie chart data:", error);
    res.status(500).json({ message: "Error fetching pie chart data" });
  }
});

app.get("/api/combined-data", async (req, res) => {
  try {
    const month = req.query.month || "may"; // default to 'may' if not provided
    const year = req.query.year || "2022"; // default to '2022' if not provided

    // Fetch data from all three APIs concurrently
    const [response1, response2, response3] = await Promise.all([
      axios.get("http://localhost:3000/api/statistics", {
        params: {
          month: month,
        },
      }),
      axios.get("http://localhost:3000/api/piechart", {
        params: {
          month: month,
        },
      }),
      axios.get("http://localhost:3000/api/BarChart", {
        params: {
          month: month,
        },
      }),
    ]);

    // Combine the responses
    const combinedData = {
      dataFromApi1: response1.data,
      dataFromApi2: response2.data,
      dataFromApi3: response3.data,
    };

    console.log("kajdcndnckadncaldckmlad", combinedData);

    // Send the combined response

    res.status(200).json(combinedData);
  } catch (error) {
    console.error("Error fetching combined data:", error);
    res.status(500).json({ message: "Error fetching combined data" });
  }
});

startserver();
