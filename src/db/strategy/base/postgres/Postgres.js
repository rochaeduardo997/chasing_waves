const Sequelize = require('sequelize');

class Postgres{
  constructor(connection, schema){
    this._connection = connection;
    this._schema     = schema;
  }

  async verifyIfIDIsValid(id){
    try{
      if((await this.read({ id })).length <= 0) throw new Error('ID not found');

      return true;
    }catch(err){
      throw new Error('ID not found');
    }
  }

  async isConnected(){
    try{
      await this._connection.authenticate();

      return true
    }catch(err){
      console.log('Failed at Sequelize authenticate', { err });

      return false;
    }
  }
  
  static connect(){
    const connection = new Sequelize({
      'username': 'admin_postgres',
      'password': 'admin_password',
      'database': 'db_chasing_waves',
      'host':     '172.17.0.2',
      'dialect':  'postgres',
      'logging':  false
    });

    return connection;
  }

  static async transaction(connection){
    try{
      const transaction = await connection.transaction();

      return transaction;
    }catch(err){
      console.log('Failed on stablish transaction', { err });

      return false;
    }
  }

  static async defineModel(connection, schema){
    const model = await connection.define(schema.name, schema.schema, schema.options);

    await model.sync();

    return model;
  }

  async create(item, transaction){
    try{
      const { dataValues } = await this._schema.create(item, { transaction });
  
      return dataValues;
    }catch(err){
      return { status: false, message: err.message };
    }
  }

  async read(query = {}, include = {}){
    return await this._schema.findAll({ where: query, raw: true });
  }

  async update(id, item){
    try{
      await this.verifyIfIDIsValid(id);

      return await this._schema.update(item, { where: { id }});
    }catch(err){
      return { status: false, message: err.message };
    }
  }

  async delete(id){
    try{
      await this.verifyIfIDIsValid(id);

      return await this._schema.destroy({ where: { id }});
    }catch(err){
      return { status: false, message: err.message };
    }
  }
}

module.exports = Postgres;
