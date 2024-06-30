const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ArcheivedChats = sequelize.define('archeivedChat', {
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
  userName: {
    type: Sequelize.STRING
  }
})

module.exports = ArcheivedChats
