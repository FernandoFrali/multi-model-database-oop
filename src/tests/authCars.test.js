const init = require('../api');
const Context = require('../db/strategies/base/contextStrategy');
const Postgres = require('../db/strategies/postgres/postgres');
const UserSchema = require('../db/strategies/postgres/schemas/userSchema');

let server;

const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJldGFUZXN0ZXIiLCJpZCI6MSwiaWF0IjoxNjgxNDMyMzk0fQ.mzO4SuJjMroPTZPq2PcTxYhnEUpB_VUubHeBEf0PF0I';

const USER = {
  username: 'betaTester',
  password: '123',
};

const USER_DB = {
  username: USER.username.toLowerCase(),
  password: '$2b$04$JH0C0U7o4jZKFgNnTrbVKujgX7AetVEc2kPp4uNVSm14JipkH0rFi',
};

describe('Auth test suit', () => {
  beforeAll(async () => {
    server = await init;

    const connectionPostgres = await Postgres.connect();
    const model = await Postgres.defineModel(connectionPostgres, UserSchema);
    const postgres = new Context(
      new Context(new Postgres(connectionPostgres, model))
    );

    await postgres.update(null, USER_DB, true);
  });

  it('should get a token', async () => {
    const result = await server.inject({
      method: 'POST',
      url: '/login',
      payload: USER,
    });

    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    expect(statusCode).toBe(200);
    expect(data.token.length).toBeGreaterThan(10);
  });

  it('should return unauthorized if try to login with wrong password', async () => {
    const result = await server.inject({
      method: 'POST',
      url: '/login',
      payload: {
        username: 'awronguser',
        password: 'wrongpassword@39494945',
      },
    });

    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    expect(statusCode).toEqual(401);
    expect(data.error).toBe('Unauthorized');
  });
});
