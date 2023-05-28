var express = require('express');
var router = express.Router();

const jwt = require("jsonwebtoken");

const user_controller = require('../models/user/userController');
const order_controller = require('../models/order/orderController');

const authen = require('../middleware/auth');


//lay user theo id
router.get('/api/get-user-by-id/:id', [authen], async function (req, res, next) {
  try {
    const { id } = req.params;
    const user = await user_controller.get_user(id);
    res.json({ error: false, responeTime: new Date(), statusCode: 200, data: user });
  } catch (error) {
    res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
  }
});

//Lay danh sach user
//http://localhost:3000/users/api/get-all-user  
router.get('/api/get-all-user', [authen], async function (req, res, next) {
  try {
    const users = await user_controller.get_users();
    res.json({ error: false, responeTime: new Date(), statusCode: 200, data: users });
  } catch (error) {
    res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
  }
});

//Đăng nhập user
//http://localhost:3000/users/api/login
router.post('/api/login', async function (req, res, next) {
  try {
    const { username, email, password, fcmToken } = req.body;
    const user = await user_controller.login(username, email, password, fcmToken);
    const accessToken = jwt.sign({ user }, 'shhhhh', { expiresIn: 80 * 24 * 60 * 60 });
    const refreshToken = jwt.sign({ user }, 'shhhhh', { expiresIn: 90 * 24 * 60 * 60 });
    if (user) {
      res.json({
        error: false, responeTime: new Date(), statusCode: 200,
        data: user, accessToken: accessToken, refreshToken: refreshToken
      });
    } else {
      res.status(422).json({
        error: true, responeTime: new Date(), statusCode: 422,
        message: 'Invalid usernamw or password'
      });
    };
  } catch (error) {
    res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
  }
});

//Cap nhat fcmToken
//http://localhost:3000/users/api/update-fcm-token
router.post('/api/update-fcm-token', [authen], async function (req, res, next) {
  try {
    const { id, fcmToken } = req.body;
    const user = await user_controller.updateFcmToken(id, fcmToken);
    res.json({ error: false, responeTime: new Date(), statusCode: 200, data: user });
  } catch (error) {
    res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
  }
});

//Đăng ký user tao luon cart va favorite cua user
//http://localhost:3000/users/api/register
router.post('/api/register', async function (req, res, next) {
  try {
    const {username,  email, password, name, birthday, numberPhone, avatar } = req.body;
    const user = await user_controller
      .register(username, email, password, name, birthday, numberPhone, avatar);
    if(user){
      //Lay ngay hien tai
      let date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let today = day + '/' + month + '/' + year;

      //Tao cart va favorite
      //dateCreate, datePayment, totalPrice, status, paymentMethod, address, idUser
      const cart = await order_controller.add_order(today, today, 0, 'cart', '', '', user._id);
      const favorite = await order_controller.add_order(today, today, 0, 'favorite', '', '', user._id);
      user.idCart = cart._id;
      user.idFavorite = favorite._id;
      user.save();
      
      res.json({ error: false, responeTime: new Date(), statusCode: 200, data: {user, cart, favorite} });
    }else{
      res.json({ error: true, responeTime: new Date(), statusCode: 500, message: 'Đăng ký thất bại' });
    }
  } catch (error) {
    res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
  }
});

//Cap nhat thong tin
//http://localhost:3000/users/api/update-profile
router.post('/api/update-profile', [authen], async function (req, res, next) {
  try {
    const { id, email, name, birthday, numberPhone, avatar } = req.body;
    const user = await user_controller.update_user(id, email, name, birthday, numberPhone, avatar);
    res.json({ error: false, responeTime: new Date(), statusCode: 200, data: user });
  } catch (error) {
    res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
  }
});

//Đổi mật khẩu
//http://localhost:3000/users/api/change-password
router.post('/api/change-password', [authen], async function (req, res, next) {
  try {
    const { id, password, new_password, confirm_password } = req.body;
    const user = await user_controller.change_password(id, password, new_password, confirm_password);
    res.json({ error: false, responeTime: new Date(), statusCode: 200, data: user });
  } catch (error) {
    res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
  }
});

//forgot password
//http://localhost:3000/users/api/forgot-password
router.post('/api/forgot-password', async function (req, res, next) {
  try {
    const { email } = req.body;
    const status = await user_controller.forgot_password(email);
    res.json({ error: false, responeTime: new Date(), statusCode: 200, data: status });
  } catch (error) {
    res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
  }
});

//reset password
//http://localhost:3000/users/api/reset-password
router.post('/api/reset-password', async function (req, res, next) {
  try {
    const { token, password, confirm_password} = req.body;
    const user = await user_controller.reset_password(token, password, confirm_password);
    res.json({ error: false, responeTime: new Date(), statusCode: 200, data: user });
  } catch (error) {
    res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
  }
});

//reset password cpanel
//http://localhost:3000/users/cpanel/reset-password/:token
router.get('/cpanel/reset-password/:token', async function (req, res, next) {
  try {
    const { token } = req.params;
    console.log(token);
    // const { password, confirm_password} = req.body;
    // const user = await user_controller.reset_password(req.params.token, password, confirm_password);
    res.render('reset-password', { token });
  } catch (error) {
    res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
  }
});


// Handle the password reset form submission
router.post('/cpanel/reset-successfully', async (req, res) => {
  const { token, password, confirm_password } = req.body;
  const user = await user_controller.reset_password(token, password, confirm_password);
  if (!user) {
    return res.status(400).send('Invalid token');
  }
  return res.status(200).send('Password reset successfully');
});


module.exports = router;
