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
          console.error('listError', listError);
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
          console.error('error', postError);
          return 'Internal server error!';
        }
      },
    };
  }

  update() {
    return {
      path: '/cars/{id}',
      method: 'PATCH',
      options: {
        validate: {
          params: Joi.object({
            id: Joi.string().required(),
          }),
          payload: Joi.object({
            name: Joi.string().min(3).max(100),
            brand: Joi.string().min(2).max(100),
          }),
        },
      },
      handler: async (req) => {
        try {
          const { id } = req.params;
          const { payload } = req;
          // with the two lines above, we are asking for javascript that we dont want 'undefined' objects. First this transform to string, then transform into object. This way, we dont save 'undefined' objects. vv
          const dataString = JSON.stringify(payload);
          const data = JSON.parse(dataString);
          console.log(data);
          const result = await this.db.update(id, data);
          console.log('result', result);

          if (result.modifiedCount !== 1)
            return {
              message: 'Failed to update Car!',
            };

          return {
            message: 'Car has been successfully updated!',
          };
        } catch (patchError) {
          console.error('patchError: ', patchError);
          return 'Internal server error!';
        }
      },
    };
  }
}

module.exports = CarRoutes;
