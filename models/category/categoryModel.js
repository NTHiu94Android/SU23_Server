const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const category_model = new Schema({
  name: { type: String },
  image: { type: String }
});

module.exports = mongoose.model('Category', category_model);