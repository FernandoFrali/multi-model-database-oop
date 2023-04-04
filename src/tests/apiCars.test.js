const init = require('../api-example');

let server;

describe('GET /cars', () => {
  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  it('should return an array of cars', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/cars',
    });
    expect(res.statusCode).toBe(200);
    expect(res.result).toBeInstanceOf(Array);
  });
});
