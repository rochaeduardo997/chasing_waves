const { strict: { deepEqual }} = require('assert');

const Context             = require('../../db/strategy/Context');
const Postgres            = require('../../db/strategy/base/postgres/Postgres');
const tbl_full_registries = require('../../db/strategy/base/postgres/schemas/tbl_full_registries');

let context = null;

describe('Must test all functions inside Postgres instance in tbl_full_registries', async () => {
  before(async () => {
    const connection = Postgres.connect();
    const model      = await Postgres.defineModel(connection, tbl_full_registries);

    context = new Context(new Postgres(connection, model));
  });

  it('Must authenticate to database', async () => {
    const result = await context.isConnected();

    deepEqual(result, true);
  });

  it('Must create a test registry and return registry informations', async () => {
    const result = await context.create({ 'status': true, 'source': 'Teste' });

    id = result.id;

    delete result.id;
    delete result.createdAt;
    delete result.updatedAt;

    deepEqual(result, { 'status': true, 'source': 'Teste' });
  });

  it('Must find all registries from database', async () => {
    const result = await context.read();

    deepEqual(result.length > 0, true);
  });

  it('Must update registry field by id', async () => {
    const [result] = await context.update(id, { 'status': false });

    deepEqual(result, 1);
  });

  it('Must update and fail with fake id', async () => {
    const result = await context.update('cc345423-be7c-4519-b8a5-e709e805e950', { 'status': false, 'source': 'Teste' });
    
    deepEqual(result.status, false);
  });

  it('Must delete registry by id', async () => {
    const result = await context.delete(id);

    deepEqual(result, 1);
  });
});
