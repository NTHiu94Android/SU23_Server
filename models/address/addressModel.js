const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const address_model = new Schema({
  body: { type: String },
  status: { type: Boolean, default: true },
  numberPhone: { type: String },
  idUser: { type: String },
});

module.exports = mongoose.model('Address', address_model);