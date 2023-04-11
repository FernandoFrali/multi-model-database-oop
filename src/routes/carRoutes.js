const Joi = require('joi');
const Boom = require('@hapi/boom');

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
        tags: ['api'],
        description: 'Should list cars',
        notes: 'can page results and filter by name',
        validate: {
          // payload -> requisition body
          // headers -> header
          // params -> URL :id
          // query -> skip=10&limit=100
          failAction,
          query: Joi.object({
            skip: Joi.number().integer().default(0),
            limit: Joi.number().integer().default(10),
            name: Joi.string().min(3).max(100),
          }),
        },
      },
      handler: (req) => {
        try {
          const { skip, limit, name } = req.query;
          const nameRegex = {
            $regex: `.*${name}*.`,
          };

          const query = name ? { name: nameRegex } : {};
          const radix = 10;

          return this.db.read(query, parseInt(skip, radix), parseInt(limit, radix));
        } catch (listError) {
          return Boom.internal();
        }
      },
    };
  }

  create() {
    return {
      path: '/cars',
      method: 'POST',
      options: {
        tags: ['api'],
        description: 'Should add cars',
        notes: 'should add cars by name, brand and year',
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
            id: result.id,
          };
        } catch (postError) {
          return Boom.internal();
        }
      },
    };
  }

  update() {
    return {
      path: '/cars/{id}',
      method: 'PATCH',
      options: {
        tags: ['api'],
        description: 'Should update cars by ID',
        notes: 'should update any field of a car',
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
          /* with the two lines above
          we are asking for javascript that we dont want 'undefined' objects.
          First this transform to string
          then transform into object. This way, we dont save 'undefined' objects. vv */
          const dataString = JSON.stringify(payload);
          const data = JSON.parse(dataString);
          const result = await this.db.update(id, data);

          if (result.modifiedCount !== 1) return Boom.preconditionFailed('ID not found on database');

          return {
            message: 'Car has been successfully updated!',
          };
        } catch (patchError) {
          return Boom.internal();
        }
      },
    };
  }

  delete() {
    return {
      path: '/cars/{id}',
      method: 'DELETE',
      options: {
        tags: ['api'],
        description: 'Should remove cars by ID',
        notes: 'ID need to be valid',
        validate: {
          params: Joi.object({
            id: Joi.string().required(),
          }),
        },
      },
      handler: async (req) => {
        try {
          const { id } = req.params;
          const result = await this.db.delete(id);

          if (result.deletedCount !== 1) return Boom.preconditionFailed('ID not found on database');

          return { message: 'Car has been successfully removed!' };
        } catch (deleteError) {
          return Boom.internal();
        }
      },
    };
  }
}

module.exports = CarRoutes;
