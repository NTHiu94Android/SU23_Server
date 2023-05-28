const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brand_model = new Schema({
  name: { type: String },
  image: { type: String },
  idCategory: { type: String },
  //idCategory: { type: Schema.Types.ObjectId, ref: 'Category' }
});

module.exports = mongoose.model('Brand', brand_model);