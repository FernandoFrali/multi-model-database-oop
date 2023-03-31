const MongoDB = require('../db/strategies/mongodb');
const Context = require('../db/strategies/base/contextStrategy');

const MOCK_CAR_CREATE = { name: 'Gol', brand: 'Volkswagen', year: 2001 };
const MOCK_CAR_UPDATE = { name: 'Strada', brand: 'Fiat', year: 2010 };

const context = new Context(new MongoDB());

describe('MongoDB CRUD', () => {
  beforeAll(async () => {
    await context.connect();
  });
  afterAll(async () => {
    await context.closeConnection();
    await context.delete();
  });

  it('should connect on database with Mongoose', async () => {
    const result = await context.isConnected();

    expect(result).toBe('Conectado');
  });

  it('should create a item on database', async () => {
    const { name, brand, year } = await context.create(MOCK_CAR_CREATE);
    const result = { name, brand, year };

    expect(result).toEqual(MOCK_CAR_CREATE);
  });

  it('should read a item on database', async () => {
    const [{ name, brand, year }] = await context.read({
      name: MOCK_CAR_CREATE.name,
    });
    const result = { name, brand, year };

    expect(result).toEqual(MOCK_CAR_CREATE);
  });

  it('should update a item on database', async () => {
    const [{ id }] = await context.read({ name: MOCK_CAR_CREATE.name });
    const updateItem = await context.update(id, {
      name: 'Strada',
      brand: 'Fiat',
      year: 2010,
    });
    const [{ name, brand, year }] = await context.read({ _id: id });
    const updatedResult = { name, brand, year };

    expect(updatedResult).toEqual(MOCK_CAR_UPDATE);
  });

  it('should delete a item on database', async () => {
    const [{ id }] = await context.read({ name: MOCK_CAR_CREATE.name });
    const result = await context.delete(id);

    expect(result.deletedCount).toBe(1);
  });
});
