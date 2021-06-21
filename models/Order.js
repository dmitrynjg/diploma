const DataTypes = require('sequelize');
const sequelize = require('../db');

const orderModel = sequelize.define(
  'orders',
  {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      ai: true,
    },
    quantity: DataTypes.INTEGER,
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    tour_id: DataTypes.INTEGER,
    airline_id: DataTypes.INTEGER,
    flight_price: DataTypes.NUMBER
  },
  {
    freezeTableName: true, 
    timestamps: false,
    underscored: true,
  }
);

module.exports = orderModel;
