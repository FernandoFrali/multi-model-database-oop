const init = require('../api-example');

let server;
const MOCK_CAR_REGISTER = {
  name: 'Spider',
  brand: 'Ferrari',
  year: 2023,
};

describe('GET /cars', () => {
  beforeAll(async () => {
    server = await init();
  });

  it('should return an array of cars', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/cars?skip=0&limit=0',
    });

    const data = JSON.parse(res.payload);

    const statusCode = res.statusCode;

    expect(statusCode).toBe(200);
    expect(data).toBeInstanceOf(Array);
  });

  it('should return only 10 registries', async () => {
    const SIZE_LIMIT = 3;
    const result = await server.inject({
      method: 'GET',
      url: `/cars?skip=0&limit=${SIZE_LIMIT}`,
    });

    const dados = JSON.parse(result.payload);

    expect(dados.length).toEqual(SIZE_LIMIT);
  });

  it('should return a type fail', async () => {
    const SIZE_LIMIT = 'test';
    const result = await server.inject({
      method: 'GET',
      url: `/cars?skip=0&limit=${SIZE_LIMIT}`,
    });

    const dados = JSON.parse(result.payload);
    const statusCode = dados.statusCode;

    expect(statusCode).toEqual(400);
  });

  it('should register a car', async () => {
    const result = await server.inject({
      method: 'POST',
      url: `/cars`,
      payload: JSON.stringify(MOCK_CAR_REGISTER),
    });
    console.log('result', result);
    const statusCode = result.statusCode;
    const { message } = JSON.parse(result.payload);

    expect(statusCode).toEqual(200);
    expect(message).toBe('Car has been successfully registered!');
  });
});
