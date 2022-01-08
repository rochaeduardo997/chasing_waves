const { strict: { deepEqual }} = require('assert');

const Context             = require('../../db/strategy/Context');
const Postgres            = require('../../db/strategy/base/postgres/Postgres');
const tbl_dates           = require('../../db/strategy/base/postgres/schemas/tbl_dates');
const tbl_full_registries = require('../../db/strategy/base/postgres/schemas/tbl_full_registries');

let context             = null;
let fullRegistryContext = null;

let dateId     = null;
let registryId = null;

let CREATE_DATE_MODEL = null;
let UPDATE_DATE_MODEL = null;

describe('Must test all functions inside Postgres instance in tbl_dates', async () => {
  before(async () => {
    const connection = Postgres.connect();
    const model      = await Postgres.defineModel(connection, tbl_dates);

    const fullRegistryModel = await Postgres.defineModel(connection, tbl_full_registries);
    fullRegistryContext     = new Context(new Postgres(connection, fullRegistryModel));
    result                  = await fullRegistryContext.create({ 'status': true, 'source': 'Test' });
    registryId              = result.id;

    CREATE_DATE_MODEL = {
      'year':  2021,
      'month': 12,
      'day':   30,
      'fk_full_registry_id': registryId
    };
    UPDATE_DATE_MODEL = {
      'year':  2022,
      'month': 1,
      'day':   1,
      'fk_full_registry_id': registryId
    };

    context = new Context(new Postgres(connection, model));
  });
  after(async () => {
    await fullRegistryContext.delete(registryId);
  });

  it('Must authenticate to database', async () => {
    const result = await context.isConnected();

    deepEqual(result, true);
  });

  it('Must create a date test and return date table informations', async () => {
    const result = await context.create(CREATE_DATE_MODEL);

    dateId = result.id;

    delete result.id;

    deepEqual(result, CREATE_DATE_MODEL);
  });

  it('Must find all dates registry from database', async () => {
    const result = await context.read();

    deepEqual(result.length > 0, true);
  });

  it('Must update date field by id', async () => {
    const [result] = await context.update(dateId, UPDATE_DATE_MODEL);

    deepEqual(result, 1);
  });

  it('Must update and fail with fake id', async () => {
    const result = await context.update('cc345423-be7c-4519-b8a5-e709e805e950', UPDATE_DATE_MODEL);
    
    deepEqual(result.status, false);
  });

  it('Must delete full registry and cannot find data from tbl_dates with id', async () => {
    const result = await context.delete(dateId);

    deepEqual(result, 1);
  });
});
