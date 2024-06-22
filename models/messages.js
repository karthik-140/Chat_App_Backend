const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Messages = sequelize.define('message', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false
  },
})

module.exports = Messages
