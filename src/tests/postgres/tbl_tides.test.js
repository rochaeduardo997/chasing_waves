const { strict: { deepEqual }} = require('assert');

const Context             = require('../../db/strategy/Context');
const Postgres            = require('../../db/strategy/base/postgres/Postgres');
const tbl_tides           = require('../../db/strategy/base/postgres/schemas/tbl_tides');
const tbl_full_registries = require('../../db/strategy/base/postgres/schemas/tbl_full_registries');

let context = null;
let fullRegistryContext = null;

let id         = null;
let registryId = null;

let CREATE_TIDE_MODEL = null;
let UPDATE_TIDE_MODEL = null;

describe('Must test all functions inside Postgres instance in tbl_tides', async () => {
  before(async () => {
    const connection = Postgres.connect();
    const model      = await Postgres.defineModel(connection, tbl_tides);

    const fullRegistryModel = await Postgres.defineModel(connection, tbl_full_registries);
    fullRegistryContext     = new Context(new Postgres(connection, fullRegistryModel));
    result                  = await fullRegistryContext.create({ 'status': true, 'source': 'Test' });
    registryId              = result.id;
    
    CREATE_TIDE_MODEL = {
      'first_tide_hour':  '5:28',
      'first_tide':       '2,38m',
    
      'second_tide_hour':  '5:28',
      'second_tide':       '0,22m',
    
      'third_tide_hour':  '5:28',
      'third_tide':       '2,56m',
    
      'fourth_tide_hour':  '5:28',
      'fourth_tide':       '0,01m',

      'fk_full_registry_id': registryId
    };
    UPDATE_TIDE_MODEL = {
      'first_tide_hour':  '5:28',
      'first_tide':       '2,9m',
      
      'second_tide_hour':  '5:28',
      'second_tide':       '0,4m',
    
      'third_tide_hour':  '5:28',
      'third_tide':       '3,2m',
    
      'fourth_tide_hour':  '5:28',
      'fourth_tide':       '0,1m',

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

  it('Must create a tide test and return its informations', async () => {
    const result = await context.create(CREATE_TIDE_MODEL);

    id = result.id;

    delete result.id;

    deepEqual(result, CREATE_TIDE_MODEL);
  });

  it('Must find all tides from database', async () => {
    const result = await context.read();

    deepEqual(result.length > 0, true);
  });

  it('Must update tide field by id', async () => {
    const [result] = await context.update(id, UPDATE_TIDE_MODEL);

    deepEqual(result, 1);
  });

  it('Must update and fail with fake id', async () => {
    const result = await context.update('cc345423-be7c-4519-b8a5-e709e805e950', UPDATE_TIDE_MODEL);
    
    deepEqual(result.status, false);
  });

  it('Must delete tide by id', async () => {
    const result = await context.delete(id);

    deepEqual(result, 1);
  });
});
