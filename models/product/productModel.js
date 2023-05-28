const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const product_model = new Schema({
  name: { type: String },
  image: { type: String },
  idCategory: { type: String },
  idBrand: { type: String },
});

module.exports = mongoose.model('Product', product_model);