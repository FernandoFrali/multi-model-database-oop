const Postgres = require('../db/strategies/postgres');
const Context = require('../db/strategies/base/contextStrategy');

const MOCK_CAR_CREATE = { carName: 'Gol', fuelType: 'Gasoline', year: 2001 };
const MOCK_CAR_UPDATE = { carName: 'Strada', fuelType: 'Diesel', year: 2010 };

const context = new Context(new Postgres());

describe('Postgres CRUD', () => {
  beforeAll(async () => {
    await context.connect();
    await context.delete();
    await context.create(MOCK_CAR_CREATE);
    await context.create(MOCK_CAR_UPDATE);
  });
  afterAll(async () => {
    await context.closeConnection();
  });

  it('should connect to database with Sequelize', async () => {
    const result = await context.isConnected();
    expect(result).toBeTruthy();
  });

  it('should create a item on database', async () => {
    const { carName, fuelType, year } = await context.create(MOCK_CAR_CREATE);
    expect({ carName, fuelType, year }).toEqual(MOCK_CAR_CREATE);
  });

  it('should read a item on database', async () => {
    const [{ carName, fuelType, year }] = await context.read(MOCK_CAR_CREATE);
    const result = { carName, fuelType, year };

    expect(MOCK_CAR_CREATE).toEqual(result);
  });

  it('should update a item on database', async () => {
    const [car] = await context.read(MOCK_CAR_CREATE);
    await context.update(car.id, MOCK_CAR_UPDATE);
    const [{ carName, fuelType, year }] = await context.read({ id: car.id });
    const result = { carName, fuelType, year };

    expect(MOCK_CAR_UPDATE).toEqual(result);
  });

  it('should delete a item on database', async () => {
    const [car] = await context.read();
    const result = await context.delete(car.id);

    expect(result).toBe(1);
  });
});
