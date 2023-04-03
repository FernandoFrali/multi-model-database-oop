const request = require('supertest');
const app = require('../api-example');

describe('GET /cars', () => {
  it('should return an array of cars', async () => {
    const response = await request(app).get('/cars');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
