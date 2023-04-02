const Sequelize = require('sequelize');

const CarSchema = {
  name: 'cars',
  schema: {
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
  options: {
    tableName: 'TB_CARS',
    freezeTableName: false,
  },
};

module.exports = CarSchema;
