var express = require('express');
var router = express.Router();

const cloudinary = require('cloudinary').v2;
const multer = require('../middleware/multer');

const jwt = require("jsonwebtoken");

const user_controller = require('../models/user/userController');
const order_controller = require('../models/order/orderController');
const order_detail_controller = require('../models/order-detail/orderDetailController');
const product_controller = require('../models/product/productController');
const sub_product_controller = require('../models/sub-product/subProductController');
const category_controller = require('../models/category/categoryController');
const brand_controller = require('../models/brand/brandController');
const review_controller = require('../models/review/reviewController');
const address_controller = require('../models/address/addressController');
const picture_controller = require('../models/picture/pictureController');

//------------------ Middleware để kiểm tra accessToken --------------------
const checkAccessTokenMiddleware = (req, res, next) => {
    //Lay accessToken tu session
    const accessToken = req.session.accessToken;
    console.log('accessToken check: ', accessToken);
    if (!accessToken) {
        // Chuyển hướng đến trang đăng nhập
        return res.redirect('/');
    }
    try {
        const decoded = jwt.verify(accessToken, 'shhhhh');
        const expiresAt = decoded.exp * 1000; // Đổi giây thành milliseconds

        // Kiểm tra thời gian hết hạn của accessToken
        if (expiresAt < Date.now()) {
            // Thực hiện đăng xuất
            req.session.accessToken = null; // Xóa accessToken từ session hoặc lưu trữ khác
            return res.redirect('/'); // Chuyển hướng đến trang đăng nhập
        }
    } catch (err) {
        // Xử lý khi accessToken không hợp lệ
        console.error(err);
        return res.redirect('/');
    }
    // Nếu có accessToken, tiếp tục
    next();
};

//---------------------------------Login---------------------------------
router.get('/', function (req, res, next) {
    res.render('login', { title: 'iTech - Admin login' });
});

router.post('/', async function (req, res, next) {
    try {
        const { username, password } = req.body;
        //username, email, password, fcmtoken
        const user = await user_controller.login(username, null, password, '');

        if (!user) {
            res.status(401).render('Error', { message: 'Not authorization' });
            return;
        }
        if (user.role == 'admin') {
            //Luu accessToken vao session
            const accessToken = jwt.sign({ user }, 'shhhhh', { expiresIn: 80 * 24 * 60 * 60 });
            req.session.accessToken = accessToken;
            console.log('accessToken: ', req.session.accessToken);
            res.redirect('home');
        } else {
            res.status(401).render('/', { message: 'Not authorization' });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//---------------------------------Home---------------------------------
router.get('/home', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        res.render('home', { title: 'iTech - Admin home' });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;