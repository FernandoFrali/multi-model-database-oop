const Context = require('../db/strategies/base/contextStrategy');
const MongoDB = require('../db/strategies/mongodb/mongodb');

const BaseRoute = require('./base/baseRoute');

class CarRoutes extends BaseRoute {
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    return {
      method: 'GET',
      path: '/cars',
      handler: (req, head) => {
        return this.db.read();
      },
    };
  }
}

module.exports = CarRoutes;
