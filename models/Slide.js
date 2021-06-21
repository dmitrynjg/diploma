const DataTypes = require('sequelize');
const sequelize = require('../db');

const slideModel = sequelize.define(
  'tours_slides',
  {
    slide_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tour_id: DataTypes.INTEGER,
    slide: DataTypes.STRING,
  },
  {
    freezeTableName: true,
    timestamps: false,
    underscored: true,
  }
);

module.exports = slideModel;
