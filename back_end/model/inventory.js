const mongoose = require("mongoose");

const inventory_schema = mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String },
  sold: { type: Boolean, required: true },
  dateOfSale: { type: Date, required: true },
});

module.exports = mongoose.model("Inventory", inventory_schema);