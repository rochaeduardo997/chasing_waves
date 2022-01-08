const Sequelize = require('sequelize');

const tbl_dates = {
  'name': 'tbl_dates',
  'schema': {
    'id': { 'type': Sequelize.INTEGER, 'allowNull': false, 'autoIncrement': true, 'primaryKey': true },

    'year':  { 'type': Sequelize.INTEGER, 'allowNull': false, 'validate': { 'min': 1, 'max': 3000, isDecimal: true }},
    'month': { 'type': Sequelize.INTEGER, 'allowNull': false, 'validate': { 'min': 1, 'max': 12,   isDecimal: true }},
    'day':   { 'type': Sequelize.INTEGER, 'allowNull': false, 'validate': { 'min': 1, 'max': 31,   isDecimal: true }},

    'fk_full_registry_id': { 
      'type':        Sequelize.INTEGER, 
      'allowNull':   false, 
      'onUpdate':   'CASCADE', 
      'onDelete':   'CASCADE', 
      'references': { 'model': 'tbl_full_registries', 'key': 'id' }
    }
  },
  'options': {
    'tableName':       'tbl_dates',
    'freezeTableName': false,
    'timestamps':      false
  }
}

module.exports = tbl_dates;
