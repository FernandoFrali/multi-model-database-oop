const mongoose = require('mongoose');
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

module.exports = mongoose.model('cars', carSchema);
