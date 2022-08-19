const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('db', 'user', 'pass', {
  dialect: 'sqlite',
  storage: 'path/db.sqlite',
  pool: {
    max: 3,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  omitNull: true,
  operatorsAliases: false,
});

sequelize.sync();

module.exports = sequelize;
