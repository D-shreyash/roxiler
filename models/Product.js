const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const Product = sequelize.define("Product", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sold: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  dateOfSale: {
    type: DataTypes.DATE,
  },
});

module.exports = Product;
