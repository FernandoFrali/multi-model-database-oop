const Hapi = require('@hapi/hapi');
const HapiSwagger = require('hapi-swagger');
const Vision = require('@hapi/vision');
const Inert = require('@hapi/inert');
const HapiJwt = require('hapi-auth-jwt2');

const CarRoute = require('./routes/carRoutes');
const AuthRoute = require('./routes/authRoutes');

const Context = require('./db/strategies/base/contextStrategy');
const MongoDB = require('./db/strategies/mongodb/mongodb');
const CarSchema = require('./db/strategies/mongodb/schemas/carSchema');

const JWT_SECRET = 'ITS_SECRET_123';

const server = new Hapi.Server({ port: 4040, host: 'localhost' });

function mapRoutes(instance, methods) {
  return methods.map((method) => instance[method]());
}

const init = async () => {
  const connection = MongoDB.connect();
  const context = new Context(new MongoDB(connection, CarSchema));

  const swaggerOptions = {
    info: {
      title: 'Cars API',
      version: 'v1.0',
    },
  };

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
    validate: () => ({ isValid: true }),
  });

  server.auth.default('jwt');

  server.route([
    ...mapRoutes(new CarRoute(context), CarRoute.methods()),
    ...mapRoutes(new AuthRoute(JWT_SECRET), AuthRoute.methods()),
  ]);

  await server.start();

  return server;
};

module.exports = init();
