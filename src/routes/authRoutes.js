const Joi = require('joi');
const Boom = require('@hapi/boom');
const Jwt = require('jsonwebtoken');

const BaseRoute = require('./base/baseRoute');

const failAction = (request, head, error) => {
  throw error;
};

const USER = {
  username: 'betaTester',
  password: '123',
};

class AuthRoute extends BaseRoute {
  constructor(secret) {
    super();
    this.secret = secret;
  }

  login() {
    return {
      path: '/login',
      method: 'POST',
      options: {
        auth: false,
        tags: ['api'],
        description: 'Get token',
        notes: 'login with user and password on database',
        validate: {
          failAction,
          payload: Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
          }),
        },
      },
      handler: async (req) => {
        const { username, password } = req.payload;

        if (username !== USER.username || password !== USER.password) {
          return Boom.unauthorized();
        }

        const token = Jwt.sign(
          {
            username,
            id: 1,
          },
          this.secret,
        );

        return {
          token,
        };
      },
    };
  }
}

module.exports = AuthRoute;
