const init = require('../api');

const MOCK_CAR_REGISTER = {
  name: 'Spider',
  brand: 'Ferrari',
  year: 2023,
};
const MOCK_CAR_INIT = {
  name: 'Aventador',
  brand: 'Lamborghini',
  year: 2022,
};

let server;
let MOCK_ID = '';

describe('/cars route tests', () => {
  beforeAll(async () => {
    server = await init;

    const result = await server.inject({
      method: 'POST',
      url: '/cars',
      payload: JSON.stringify(MOCK_CAR_INIT),
    });

    const data = JSON.parse(result.payload);
    MOCK_ID = data.id;
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

    const data = JSON.parse(result.payload);

    expect(data.length).toEqual(SIZE_LIMIT);
  });

  it('should return a type fail', async () => {
    const SIZE_LIMIT = 'test';
    const result = await server.inject({
      method: 'GET',
      url: `/cars?skip=0&limit=${SIZE_LIMIT}`,
    });

    const data = JSON.parse(result.payload);
    const statusCode = data.statusCode;

    expect(statusCode).toEqual(400);
  });

  it('should register a car', async () => {
    const result = await server.inject({
      method: 'POST',
      url: '/cars',
      payload: JSON.stringify(MOCK_CAR_REGISTER),
    });

    const statusCode = result.statusCode;
    const { message } = JSON.parse(result.payload);

    expect(statusCode).toEqual(200);
    expect(message).toBe('Car has been successfully registered!');
  });

  it('should update a car', async () => {
    const id = MOCK_ID;
    const expected = {
      name: 'Hurracane',
    };

    const result = await server.inject({
      method: 'PATCH',
      url: `/cars/${id}`,
      payload: JSON.stringify(expected),
    });

    const statusCode = result.statusCode;
    console.log('payload', result.payload);
    const data = JSON.parse(result.payload);

    expect(statusCode).toEqual(200);
    expect(data.message).toBe('Car has been successfully updated!');
  });

  it('should get a error when try to update a car with incorrect ID', async () => {
    const id = `643463e500517dda54404de4`;
    const expected = {
      name: 'Gallardo',
    };

    const result = await server.inject({
      method: 'PATCH',
      url: `/cars/${id}`,
      payload: JSON.stringify(expected),
    });

    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    expect(statusCode).toEqual(412);
    expect(data.message).toBe('ID not found on database');
  });

  it('should delete a item', async () => {
    const id = MOCK_ID;

    const result = await server.inject({
      method: 'DELETE',
      url: `/cars/${id}`
    });

    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    expect(statusCode).toEqual(200);
    expect(data.message).toBe('Car has been successfully removed!');
  });

  it('should get a error when try to delete a item with incorrect ID', async () => {
    const id = `643463e500517dda54404de4`;

    const result = await server.inject({
      method: 'DELETE',
      url: `/cars/${id}`
    });

    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    expect(statusCode).toEqual(412);
    expect(data.message).toBe('ID not found on database');
  });
});
