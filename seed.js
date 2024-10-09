const axios = require("axios");
const sequelize = require("./config");
const Product = require("./models/Product");

const seedDatabase = async () => {
  try {
    const existingProducts = await Product.findAll();
    if (existingProducts.length > 0) {
      console.log("Products already exist. Skipping seeding.");
      return; // Exit if products already exist
    }
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );

    let products = response.data;
    await sequelize.sync();
    console.log("Database sync successfull.");

    console.log("Fetched products length:", products.length);

    products = products.map((product) => {
      const { id, ...rest } = product; // Destructure and exclude `id`
      return rest; // Return the product without the `id` field
    });

    console.log("Mapped products length:", products.length);

    await Product.bulkCreate(products);
    console.log("Database seeded successfully with fetched data.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

module.exports = seedDatabase;
