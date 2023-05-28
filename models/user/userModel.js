const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user_model = new Schema({
  email: { type: String, unique: true },
  password: { type: String, require: true },
  name: { type: String },
  birthday: { type: String, default: '' },
  numberPhone: { type: String, default: ''},
  role: { type: String, default: 'user' },
  avatar: { type: String, default: 'https://genpartners.genvita.vn/resources/avatar/0212fec9-6c66-4c77-ba20-a0cb6aefe91f?width=119&height=119&mode=crop' },
  //updateAt: { type: Date, default: Date.now },
  idCart: {type: Object},
  idFavorite: {type: Object},

  loginType: { type: String },
  username: { type: String, },

  //token
  resetPasswordToken: { type: String, require: false, default: null },
  fcmtoken: { type: String, require: false, default: null },
});

module.exports = mongoose.model('User', user_model);