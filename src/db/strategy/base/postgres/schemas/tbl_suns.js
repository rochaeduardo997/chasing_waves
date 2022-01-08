const Sequelize = require('sequelize');

const tbl_suns = {
  'name': 'tbl_suns',
  'schema': {
    'id': { 'type': Sequelize.INTEGER, 'allowNull': false, 'autoIncrement': true, 'primaryKey': true },

    'sunrise': { 'type': Sequelize.STRING, 'allowNull': false },
    'sunset':  { 'type': Sequelize.STRING, 'allowNull': false },

    'fk_full_registry_id': { 
      'type':        Sequelize.INTEGER, 
      'allowNull':   false, 
      'onUpdate':   'CASCADE', 
      'onDelete':   'CASCADE', 
      'references': { 'model': 'tbl_full_registries', 'key': 'id' }
    }
  },
  'options': {
    'tableName':       'tbl_suns',
    'freezeTableName': false,
    'timestamps':      false
  }
}

module.exports = tbl_suns;
