const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_TABLE, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  pool: {
    max: 3,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  omitNull: true,
  port: 3306,
});

module.exports = sequelize;
