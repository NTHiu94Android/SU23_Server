const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const order_detail_model = new Schema({
  quantity: { type: Number },
  price: { type: Number },
  isCmt: { type: Boolean, default: false },
  idOrder: { type: String },
  idSubProduct: { type: String },
});

module.exports = mongoose.model('OrderDetail', order_detail_model);