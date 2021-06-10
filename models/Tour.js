const DataTypes = require('sequelize');
const sequelize = require('../db');

const tourModel = sequelize.define(
  'tours',
  {
    tour_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    poster: {
      type: DataTypes.STRING,
      defaultValue: '../../uploads/default.png',
    },
    title: DataTypes.TEXT,
    desc: DataTypes.TEXT,
    price: DataTypes.DECIMAL,
    number_of_seats: DataTypes.INTEGER,
    tour_from: DataTypes.STRING,
    tour_to: DataTypes.STRING,
    date_start: DataTypes.DATE,
    date_end: DataTypes.DATE,
    owner_id: DataTypes.INTEGER,
    tour_from_code: DataTypes.STRING,
    tour_to_code: DataTypes.STRING,
  },
  {
    freezeTableName: true,
    timestamps: false,
    underscored: true,
  }
);

module.exports = tourModel;
