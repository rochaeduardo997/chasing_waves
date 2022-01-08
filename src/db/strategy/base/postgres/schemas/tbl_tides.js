const Sequelize = require('sequelize');

const tbl_tides = {
  'name': 'tbl_tides',
  'schema': {
    'id': { 'type': Sequelize.INTEGER, 'allowNull': false, 'autoIncrement': true, 'primaryKey': true },

    'first_tide_hour':  { 'type': Sequelize.STRING, 'allowNull': false },
    'first_tide':       { 'type': Sequelize.STRING, 'allowNull': false },

    'second_tide_hour': { 'type': Sequelize.STRING, 'allowNull': false },
    'second_tide':      { 'type': Sequelize.STRING, 'allowNull': false },

    'third_tide_hour':  { 'type': Sequelize.STRING, 'allowNull': false },
    'third_tide':       { 'type': Sequelize.STRING, 'allowNull': false },

    'fourth_tide_hour': { 'type': Sequelize.STRING, 'allowNull': true  },
    'fourth_tide':      { 'type': Sequelize.STRING, 'allowNull': true  },

    'fk_full_registry_id': { 
      'type':        Sequelize.INTEGER, 
      'allowNull':   false, 
      'onUpdate':   'CASCADE', 
      'onDelete':   'CASCADE', 
      'references': { 'model': 'tbl_full_registries', 'key': 'id' }
    }
  },
  'options': {
    'tableName':       'tbl_tides',
    'freezeTableName': false,
    'timestamps':      false
  }
}

module.exports = tbl_tides;
