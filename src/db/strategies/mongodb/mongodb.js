const IDatabase = require('../interfaces/interfaceDatabase');
const mongoose = require('mongoose');

const STATUS = {
  0: 'Desconectado',
  1: 'Conectado',
  2: 'Conectando',
  3: 'Desconectando',
};

class MongoDB extends IDatabase {
  constructor(connection, schema) {
    super();
    this._connection = connection;
    this._schema = schema;
  }
  async isConnected() {
    const state = STATUS[this._connection.readyState];
    if (state === 'Conectado') return state;

    if (state === 'Conectando') return state;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return STATUS[mongoose.connection.readyState];
  }

  static async connect() {
    const MONGODB_URI =
      process.env.MONGODB_URI || 'mongodb://frali:mypass@localhost:27017/cars';

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
    });

    const connection = mongoose.connection;

    connection.once('open', () => {
      console.log('Database is running!');
    });

    return connection;
  }

  async closeConnection() {
    return mongoose.disconnect();
  }

  create(item) {
    return this._schema.create(item);
  }

  read(item, skip = 0, limit = 10) {
    return this._schema.find(item).skip(skip).limit(limit);
  }

  update(id, item) {
    return this._schema.updateOne({ _id: id }, { $set: item });
  }

  delete(id) {
    return this._schema.deleteOne({ _id: id });
  }
}

module.exports = MongoDB;
