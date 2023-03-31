const IDatabase = require('./interfaces/interfaceDatabase');
const mongoose = require('mongoose');

const STATUS = {
  0: 'Desconectado',
  1: 'Conectado',
  2: 'Conectando',
  3: 'Desconectando',
};

class MongoDB extends IDatabase {
  constructor() {
    super();
    this._connection = null;
    this._cars = null;
  }
  async isConnected() {
    const state = STATUS[this._connection.readyState];
    if (state === 'Conectado') return state;

    if (state === 'Conectando') return state;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return STATUS[mongoose.connection.readyState];
  }

  defineModel() {
    const carSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      brand: {
        type: String,
        required: true,
      },
      insertedAt: {
        type: Date,
        default: new Date(),
      },
      year: {
        type: Number,
        required: true,
      },
    });

    this._cars = mongoose.model('cars', carSchema);
  }

  async connect() {
    const MONGODB_URI =
      process.env.MONGODB_URI || 'mongodb://nandin:mypass@localhost:27017/cars';

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
    });

    const connection = mongoose.connection;
    this._connection = connection;
    connection.once('open', () => {
      console.log('Database is running!');
    });
    this.defineModel();
  }

  async closeConnection() {
    return mongoose.disconnect();
  }

  create(item) {
    return this._cars.create(item);
  }

  read(item, skip = 0, limit = 10) {
    return this._cars.find(item).skip(skip).limit(limit);
  }

  update(id, item) {
    return this._cars.updateOne({ _id: id }, { $set: item });
  }

  delete(id) {
    if (!id) throw new Error('ID field cannot be empty');
    return this._cars.deleteOne({ _id: id });
  }
}

module.exports = MongoDB;
