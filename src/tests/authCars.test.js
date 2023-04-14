const init = require('../api');
let server;
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJldGFUZXN0ZXIiLCJpZCI6MSwiaWF0IjoxNjgxNDMyMzk0fQ.mzO4SuJjMroPTZPq2PcTxYhnEUpB_VUubHeBEf0PF0I';

describe('Auth test suit', () => {
  beforeAll(async () => {
    server = await init;
  });

  it('should get a token', async () => {
    const result = await server.inject({
      method: 'POST',
      url: '/login',
      payload: {
        username: 'betaTester',
        password: '123'
      }
    });

    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    expect(statusCode).toBe(200);
    expect(data.token.length).toBeGreaterThan(10);
  });
});
