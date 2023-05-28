const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const order_model = new Schema({
  dateCreate: { type: String },
  datePayment: { type: String, default: '' },
  totalPrice: { type: Number },
  status: { type: String },
  paymentMethod: { type: String },
  address: { type: String },
  idUser: { type: String },
});

module.exports = mongoose.model('Order', order_model);