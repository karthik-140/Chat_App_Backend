const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const UserGroups = sequelize.define('userGroup', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  userName: {
    type: Sequelize.STRING,
    allowNull: false
  },
})

module.exports = UserGroups
