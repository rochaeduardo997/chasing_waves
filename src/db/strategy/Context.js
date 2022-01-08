class Context{
  constructor(database){
    this._database = database;
  }

  isConnected(){
    return this._database.isConnected();
  }
  connect(){
    return this._database.connect();
  }
  transaction(){
    return this._database.transaction();
  }
  create(item, transaction = null){
    return this._database.create(item, transaction);
  }
  read(query, transaction = null){
    return this._database.read(query, transaction);
  }
  update(id, item, transaction = null){
    return this._database.update(id, item, transaction);
  }
  delete(id, transaction = null){
    return this._database.delete(id, transaction);
  }
}

module.exports = Context;
