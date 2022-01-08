const { strict: { deepEqual }} = require('assert');

const Context             = require('../../db/strategy/Context');
const Postgres            = require('../../db/strategy/base/postgres/Postgres');
const tbl_suns            = require('../../db/strategy/base/postgres/schemas/tbl_suns');
const tbl_full_registries = require('../../db/strategy/base/postgres/schemas/tbl_full_registries');

let context             = null;
let fullRegistryContext = null;

let sunId     = null;
let registryId = null;

let CREATE_SUN_MODEL = null;
let UPDATE_SUN_MODEL = null;

describe('Must test all functions inside Postgres instance in tbl_suns', async () => {
  before(async () => {
    const connection = Postgres.connect();
    const model      = await Postgres.defineModel(connection, tbl_suns);

    const fullRegistryModel = await Postgres.defineModel(connection, tbl_full_registries);
    fullRegistryContext     = new Context(new Postgres(connection, fullRegistryModel));
    result                  = await fullRegistryContext.create({ 'status': true, 'source': 'Test' });
    registryId              = result.id;
    
    CREATE_SUN_MODEL = {
      'sunrise':  '5:28',
      'sunset':   '17:48',
      'fk_full_registry_id': registryId
    };
    UPDATE_SUN_MODEL = {
      'sunrise':  '5:30',
      'sunset':   '17:40',
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

  it('Must create a sun registry and return its informations', async () => {
    const result = await context.create(CREATE_SUN_MODEL);

    sunId = result.id;

    delete result.id;

    deepEqual(result, CREATE_SUN_MODEL);
  });

  it('Must find all sun registries from database', async () => {
    const result = await context.read();

    deepEqual(result.length > 0, true);
  });

  it('Must update sun registry field by id', async () => {
    const [result] = await context.update(sunId, UPDATE_SUN_MODEL);

    deepEqual(result, 1);
  });

  it('Must update and fail with fake id', async () => {
    const result = await context.update('cc345423-be7c-4519-b8a5-e709e805e950', UPDATE_SUN_MODEL);
    
    deepEqual(result.status, false);
  });

  it('Must delete sun registry by id', async () => {
    const result = await context.delete(sunId);

    deepEqual(result, 1);
  });
});
