const Joi = require('joi');
const Boom = require('@hapi/boom');
const Jwt = require('jsonwebtoken');
const PasswordHelper = require('../helpers/passwordHelper');

const BaseRoute = require('./base/baseRoute');

const failAction = (request, head, error) => {
  throw error;
};

const USER = {
  username: 'betaTester',
  password: '123',
};

class AuthRoute extends BaseRoute {
  constructor(secret, db) {
    super();
    this.db = db;
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

        const [user] = await this.db.read({
          username: username.toLowerCase(),
        });

        if (!user) {
          return Boom.unauthorized('Invalid user or password!');
        }

        const match = await PasswordHelper.comparePassword(password, user.password);

        if (!match) {
          return Boom.unauthorized('Invalid user or password!');
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
