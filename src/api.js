const Hapi = require('@hapi/hapi');
const HapiSwagger = require('hapi-swagger');
const Vision = require('@hapi/vision');
const Inert = require('@hapi/inert');
const HapiJwt = require('hapi-auth-jwt2');
const Postgres = require('./db/strategies/postgres/postgres');
const UserSchema = require('./db/strategies/postgres/schemas/userSchema');

const CarRoute = require('./routes/carRoutes');
const AuthRoute = require('./routes/authRoutes');

const Context = require('./db/strategies/base/contextStrategy');
const MongoDB = require('./db/strategies/mongodb/mongodb');
const CarSchema = require('./db/strategies/mongodb/schemas/carSchema');

const JWT_SECRET = 'ITS_SECRET_123';

const swaggerOptions = {
  info: {
    title: 'Cars API',
    version: 'v1.0',
  },
};

const server = new Hapi.Server({ port: 4040, host: 'localhost' });

function mapRoutes(instance, methods) {
  return methods.map((method) => instance[method]());
}

const init = async () => {
  const connectionMongoDB = MongoDB.connect();
  const contextMongoDB = new Context(new MongoDB(connectionMongoDB, CarSchema));

  const connectionPostgres = await Postgres.connect();
  const model = await Postgres.defineModel(connectionPostgres, UserSchema);
  const contextPostgres = new Context(new Postgres(connectionPostgres, model));

  await server.register([
    HapiJwt,
    Vision,
    Inert,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  server.auth.strategy('jwt', 'jwt', {
    key: JWT_SECRET,
    validate: async (data) => {
      console.log('data', data);
      const [result] = await contextPostgres.read({
        username: data.username.toLowerCase(),
      });
      console.log('result', result);
      if (!result) return { isValid: false };

      return { isValid: true };
    },
  });

  server.auth.default('jwt');

  server.route([
    ...mapRoutes(new CarRoute(contextMongoDB), CarRoute.methods()),
    ...mapRoutes(new AuthRoute(JWT_SECRET, contextPostgres), AuthRoute.methods()),
  ]);

  await server.start();

  return server;
};

module.exports = init();
