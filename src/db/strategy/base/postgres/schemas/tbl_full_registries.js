const Sequelize = require('sequelize');

const tbl_full_registries = {
  'name': 'tbl_full_registries',
  'schema': {
    'id': { 'type': Sequelize.INTEGER, 'allowNull': false, 'autoIncrement': true, 'primaryKey': true },

    'source': { 'type': Sequelize.STRING, 'allowNull': false },

    'status': { 'type': Sequelize.BOOLEAN, 'defaultValue': true },
    
    'createdAt': { 'type': Sequelize.DATE },
    'updatedAt': { 'type': Sequelize.DATE }
  },
  'options': {
    'tableName':       'tbl_full_registries',
    'freezeTableName': false,
    'timestamps':      true
  }
}

module.exports = tbl_full_registries;
