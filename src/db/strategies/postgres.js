const IDatabase = require('./interfaces/interfaceDatabase');
const Sequelize = require('sequelize');

class Postgres extends IDatabase {
  constructor() {
    super();
    this._connection = null;
    this._cars = null;
  }
  async isConnected() {
    try {
      await this._connection.authenticate();
      return true;
    } catch (error) {
      console.log('Failed!', error);
    }
  }

  async defineModel() {
    this._cars = this._connection.define(
      'cars',
      {
        id: {
          type: Sequelize.INTEGER,
          required: true,
          primaryKey: true,
          autoIncrement: true,
        },
        carName: {
          type: Sequelize.STRING,
          required: true,
        },
        fuelType: {
          type: Sequelize.STRING,
          required: true,
        },
        year: {
          type: Sequelize.INTEGER,
          required: true,
        },
      },
      {
        tableName: 'TB_CARS',
        freezeTableName: false,
      }
    );
    await this._cars.sync();
  }

  async connect() {
    this._connection = new Sequelize('cars', 'frali', 'pass', {
      host: 'localhost',
      dialect: 'postgres',
    });
    await this.defineModel();
  }

  async closeConnection() {
    return this._connection.close();
  }

  async create(item) {
    const { dataValues } = await this._cars.create(item);
    return dataValues;
  }

  async read(item) {
    const query = item ? item : {};
    return this._cars.findAll({ where: query, raw: true });
  }

  async update(id, item) {
    return this._cars.update(item, { where: { id: id } });
  }

  async delete(id) {
    const query = id ? { id } : {};
    return this._cars.destroy({ where: query });
  }
}

module.exports = Postgres;
