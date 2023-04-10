const Sequelize = require('sequelize');
const IDatabase = require('../interfaces/interfaceDatabase');

class Postgres extends IDatabase {
  constructor(connection, schema) {
    super();
    this._connection = connection;
    this._schema = schema;
  }

  async isConnected() {
    try {
      await this._connection.authenticate();
      return true;
    } catch (error) {
      return 'Failed to connect!';
    }
  }

  static async defineModel(connection, schema) {
    const model = connection.define(schema.name, schema.schema, schema.options);
    await model.sync();
    return model;
  }

  static async connect() {
    const connection = new Sequelize('cars', 'frali', 'pass', {
      host: '192.168.99.101',
      dialect: 'postgres',
      logging: false,
    });
    return connection;
  }

  async closeConnection() {
    return this._connection.close();
  }

  async create(item) {
    const { dataValues } = await this._schema.create(item);
    return dataValues;
  }

  async read(item) {
    const query = item || {};
    return this._schema.findAll({ where: query, raw: true });
  }

  async update(id, item) {
    return this._schema.update(item, { where: { id } });
  }

  async delete(id) {
    const query = id ? { id } : {};
    return this._schema.destroy({ where: query });
  }
}

module.exports = Postgres;
