const DataTypes = require('sequelize');
const sequelize = require('../db');

const userModel = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: DataTypes.STRING,
  name: DataTypes.STRING,
},{
  freezeTableName: true, // Model tableName will be the same as the model name
  timestamps: false,
  underscored: true
});


module.exports = userModel;
