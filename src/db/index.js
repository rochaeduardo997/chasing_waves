const Context             = require('./strategy/Context');
const Postgres            = require('./strategy/base/postgres/Postgres');

const tbl_full_registries = require('./strategy/base/postgres/schemas/tbl_full_registries');
const tbl_dates           = require('./strategy/base/postgres/schemas/tbl_dates');
const tbl_suns            = require('./strategy/base/postgres/schemas/tbl_suns');
const tbl_tides           = require('./strategy/base/postgres/schemas/tbl_tides');

const stablishConnection = async () => {
  let models  = {};
  let context = {};

  const connection = Postgres.connect();

  models.full_registries = await Postgres.defineModel(connection, tbl_full_registries);
  models.dates           = await Postgres.defineModel(connection, tbl_dates);
  models.suns            = await Postgres.defineModel(connection, tbl_suns);
  models.tides           = await Postgres.defineModel(connection, tbl_tides);
  
  const modelObjects = Object.keys(models);
  
  for(let index in modelObjects){
    context[modelObjects[index]] = new Context(new Postgres(connection, models[modelObjects[index]]));
  }

  return context;
};

const stablishTransaction = async () => {
  return await Postgres.transaction(Postgres.connect());
};

module.exports = { stablishConnection, stablishTransaction };