const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const promotion_model = new Schema({
  content: { type: String },
  isSubmit: { type: Boolean, default: false },
  sale: { type: Number },
  code: { type: String },
  dayStart: { type: String},
  dayEnd: { type: String },
  condition: { type: Number },
  idUser: { type: String },
});

module.exports = mongoose.model('Promotion', promotion_model);