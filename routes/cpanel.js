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
const categoryModel = require('../models/category/categoryModel');

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
//---------------------------------CATEGORIES---------------------------------

//Danh sach categories
router.get('/categories', checkAccessTokenMiddleware, async function (req, res) {
    try {
        const categories = await category_controller.get_all_category();
        if (!categories) {
            res.status(401).render('Error', { message: 'Not authorization' });
            return;
        }
        res.render('categories', { title: 'iTech - Category', categories: categories });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Deleete Category
router.get('/categories/:_id/delete', checkAccessTokenMiddleware, async function (req, res) {
    try {
        const { _id } = req.param;
        if (!_id) {
            res.status(401).render('Error', { message: 'Not authorization' });
            return;
        } else {
            await category_controller.delete_category(_id);
            res.json({ status: true });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Add Category 
router.get('/categories/insert', checkAccessTokenMiddleware, async function (req, res) {
    try {
        res.render('category-insert', { title: 'iTech - Category insert' });
    } catch (error) {
        res.status(500).send(error.message);
    }
});
router.post('/categories/insert', checkAccessTokenMiddleware, multer.single('picture'), async function (res, req) {
    try {
        const {name} = req.body;
        const result = await cloudinary.uploader.upload(req.file.path);
        const image = result.secure_url;
        if (!name || !image) {
            res.status(401).render('Error', { message: 'Not authorization' });
            return;
        }
        const category = await category_controller.add_category(name, image);
        if(!category){
            res.status(401).render('Error', {message:'Not authorization'});
            return;
        }
        res.redirect('/categories')
    } catch (error) {
        res.status(500).send(error.message);

    }
});

// update category
router.get('/categories/:_id/update', checkAccessTokenMiddleware, async function (req, res){
    try {
        const categories = await category_controller.get_all_category();
        for(let i = 0 ; i< categories.length; i++){
            if (categories[i]._id == req.params._id) {
                res.render('category-update', {title: 'iTech - Category', category : categories[i]});
                return;
            }
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/categories/:_id/update', checkAccessTokenMiddleware, multer.single('picture'), async function (req, res, next) {
    try {
        const { _id } = req.params;
        const { name } = req.body;
        const result = await cloudinary.uploader.upload(req.file.path);
        const image = result.secure_url;
        //console.log('Info: ', name, image, idCategory, idBrand);
        if (!name || !image || !_id) {
            res.status(401).render('Error', { message: 'Not authorization' });
            return;
        }
        const category = await category_controller.update_category(_id, name, image);
        if (!category) {
            res.status(401).render('Error', { message: 'Not authorization' });
            return;
        } else {
            res.redirect('/categories');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//---------------------------------Brands---------------------------------
// Danh sach brand 
router.get('/brands', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const brands = await brand_controller.get_all_brand();
        if (!brands) {
            res.status(401).render('Error', { message: 'Not authorization' });
            return;
        }
        let list = [];
        for (let i = 0; i < brands.length; i++) {
            const category = await category_controller.get_category_by_id(brands[i].idCategory);
            brands[i].nameCategory = category.name;
            list.push(brands[i]);
        }
        res.render('brands', { title: 'iTech - Brand', brands: list });
    } catch (error) {
        res.status(500).send(error.message);
    }
});


module.exports = router;