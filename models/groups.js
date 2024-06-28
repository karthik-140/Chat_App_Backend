const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Groups = sequelize.define('group', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  groupName: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Groups
