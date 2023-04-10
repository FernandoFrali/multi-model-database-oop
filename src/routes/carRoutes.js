const Context = require('../db/strategies/base/contextStrategy');
const MongoDB = require('../db/strategies/mongodb/mongodb');
const Joi = require('joi');

const BaseRoute = require('./base/baseRoute');

const failAction = (request, head, error) => {
  throw error;
};
class CarRoutes extends BaseRoute {
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    return {
      method: 'GET',
      path: '/cars',
      options: {
        validate: {
          // payload -> body da requisição
          // headers -> header
          // params -> na URL :id
          // query -> skip=10&limit=100
          failAction,
          query: Joi.object({
            skip: Joi.number().integer().default(0),
            limit: Joi.number().integer().default(10),
            name: Joi.string().min(3).max(100),
          }),
        },
      },
      handler: (req, head) => {
        try {
          const { skip, limit, name } = req.query;
          const nameRegex = {
            $regex: `.*${name}*.`,
          };

          const query = name ? { name: nameRegex } : {};

          return this.db.read(query, parseInt(skip), parseInt(limit));
        } catch (listError) {
          console.log('listError', listError);
          return 'Internal server error';
        }
      },
    };
  }

  create() {
    return {
      path: '/cars',
      method: 'POST',
      options: {
        validate: {
          failAction,
          payload: Joi.object({
            name: Joi.string().required().min(3).max(100),
            brand: Joi.string().required().min(2).max(100),
            year: Joi.number().required(),
          }),
        },
      },
      handler: async (req) => {
        try {
          const { name, year, brand } = req.payload;
          const result = await this.db.create({ name, year, brand });

          return {
            message: 'Car has been successfully registered!',
            _id: result._id,
          };
        } catch (postError) {
          console.log('error', postError);
          return 'Internal Server Error!';
        }
      },
    };
  }
}

module.exports = CarRoutes;
