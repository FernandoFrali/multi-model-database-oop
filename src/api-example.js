const Hapi = require('@hapi/hapi');

const CarRoute = require('./routes/carRoutes');

const Context = require('./db/strategies/base/contextStrategy');
const MongoDB = require('./db/strategies/mongodb/mongodb');
const CarSchema = require('./db/strategies/mongodb/schemas/carSchema');

const server = new Hapi.Server({
  port: 4040,
  host: 'localhost',
});

function mapRoutes(instance, methods) {
  return methods.map((method) => instance[method]());
}

const init = async () => {
  const connection = MongoDB.connect();
  const context = new Context(new MongoDB(connection, CarSchema));

  server.route([...mapRoutes(new CarRoute(context), CarRoute.methods())]);

  await server.start();
  console.log('Server running on %s', server.info.uri);

  return server;
};
// init();

module.exports = init;
