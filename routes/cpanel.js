var express = require('express');
var router = express.Router();

const cloudinary = require('cloudinary').v2;
const multer = require('../middleware/multer');

const jwt = require("jsonwebtoken");
//const notification = require('../ultils/send-notifi');

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
const promotion_controller = require('../models/promotion/promotionController');

//------------------ Middleware để kiểm tra accessToken --------------------
const checkAccessTokenMiddleware = (req, res, next) => {
    //Lay accessToken tu session
    const accessToken = req.session.accessToken;
    //console.log('accessToken check: ', accessToken);
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
            return res.redirect('/');
        }
        if (user.role == 'admin') {
            //Luu accessToken vao session
            const accessToken = jwt.sign({ user }, 'shhhhh', { expiresIn: 80 * 24 * 60 * 60 });
            req.session.accessToken = accessToken;
            req.session.user = user;
            console.log('accessToken: ', req.session.accessToken);
            res.redirect('home');
        } else {
            return res.redirect('/');
        }
    } catch (error) {
        return res.redirect('/');
    }
});




//----------------------------------Home - Thong ke----------------------------------
router.get('/home', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const orders = await order_controller.get_all_order();
        let list = [];
        let totalAll = 0;
        //Lay doanh thu trong 7 ngay gan nhat (7 ngay truoc ngay hien tai) co trang thai la 'delivered'
        for (let i = 0; i < 7; i++) {
            let date = new Date();
            date.setDate(date.getDate() - i);
            let dateStr = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
            let total = 0;
            for (let j = 0; j < orders.length; j++) {
                if (orders[j].datePayment == dateStr && orders[j].status == 'Delivered') {
                    total += orders[j].totalPrice;
                }
            }
            totalAll += total;
            list.push({ name: dateStr, value: total });
        }
        //console.log('list: ', list);
        res.render('home', { title: 'iTech - Admin Dashboard', data: list, list: JSON.stringify(list), totalAll });
    } catch (error) {
        res.redirect('/');
    }

});

//Lay tat ca don hang da giao
router.get('/cpanel/get-orders-soil', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const orders = await order_controller.get_all_order();
        let list = [];
        for (let i = 0; i < orders.length; i++) {
            if (orders[i].status == 'cart' || orders[i].status == 'favorite' || orders[i].status != 'Delivered') {
                continue;
            } else {
                list.push(orders[i]);
            }
        }
        res.status(200).json({ data: list });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Lay tat ca don hang
router.get('/cpanel/get-orders', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const orders = await order_controller.get_all_order();
        let list = [];
        for (let i = 0; i < orders.length; i++) {
            if (orders[i].status == 'cart' || orders[i].status == 'favorite') {
                continue;
            } else {
                list.push(orders[i]);
            }
        }
        res.status(200).json({ data: list });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Lay doanh thu trong hom nay
router.get('/cpanel/today', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const orders = await order_controller.get_all_order();
        let total = 0;
        let date = new Date();
        let dateStr = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        //console.log('dateStr: ', dateStr);
        for (let j = 0; j < orders.length; j++) {
            if (orders[j].datePayment == dateStr && orders[j].status == 'Delivered') {
                total += orders[j].totalPrice;
            }
        }
        //console.log('total: ', total);
        res.status(200).json({ data: total });
    } catch (error) {
        console.log('error: ', error);
        res.status(500).send(error.message);
    }
});

//Lay tat ca san pham
router.get('/cpanel/get-products', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const products = await product_controller.onGetProducts();
        res.json({ data: products });
    } catch (error) {
        res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
    }
});

//Lay tat ca user
router.get('/cpanel/users', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const users = await user_controller.get_users();
        //Bo user co role = admin
        let list = [];
        for (let i = 0; i < users.length; i++) {
            if (users[i].role != 'admin') {
                list.push(users[i]);
            }
        }
        res.status(200).json({ data: list });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//update date subProduct
router.get('/cpanel/update-date-subProduct', async function (req, res, next) {
    try {
        const subProducts = await sub_product_controller.onGetSubProducts();
        for (let i = 0; i < subProducts.length; i++) {
            await sub_product_controller.onUpdateDateSubProduct(subProducts[i]._id);
        }
        res.json({ error: false, responeTime: new Date(), statusCode: 200, message: 'Update date subProduct successfully' });
    } catch (error) {
        res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
    }
});

//Update date product
router.get('/cpanel/update-date-product', async function (req, res, next) {
    try {
        const products = await product_controller.onGetProducts();
        for (let i = 0; i < products.length; i++) {
            await product_controller.onUpdateDateProduct(products[i]._id);
        }
        const products2 = await product_controller.onGetProducts();
        res.json({ error: false, responeTime: new Date(), statusCode: 200, message: 'Update date product successfully', data: products2 });
    } catch (error) {
        res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
    }
});

//Update date user
router.get('/cpanel/update-date-user', async function (req, res, next) {
    try {
        const users = await user_controller.get_users();
        for (let i = 0; i < users.length; i++) {
            await user_controller.updateDateRegister(users[i]._id);
        }
        const user2 = await user_controller.get_users();
        res.json({ error: false, responeTime: new Date(), statusCode: 200, message: 'Update date user successfully', data: user2 });
    } catch (error) {
        res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
    }
});

//Tinh pham tram san pham hien tai so voi hom qua
router.get('/cpanel/get-percent', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const products = await product_controller.onGetProducts();
        let total = 0;
        let totalYesterday = 0;
        let date = new Date();
        let dateYesterday = new Date();
        dateYesterday.setDate(dateYesterday.getDate() - 1);
        let dateYesterday2 = new Date();
        dateYesterday2.setDate(dateYesterday2.getDate() - 2);
        //console.log('dateStr: ', date + ' - ' + dateYesterday + ' - ' + dateYesterday2);
        for (let j = 0; j < products.length; j++) {
            let dateProduct = new Date(products[j].dateInput);
            if (dateProduct <= date && dateProduct > dateYesterday) {
                total++;
            }
            if (dateProduct <= dateYesterday && dateProduct > dateYesterday2) {
                totalYesterday++;
            }
        }
        // console.log('total: ', total);
        // console.log('totalYesterday: ', totalYesterday);
        let percent = 0;
        //console.log('total: ', total + ' - totalYesterday: ', totalYesterday);
        if (totalYesterday != 0) {
            percent = (total - totalYesterday) / totalYesterday * 100;
            percent = Math.round(percent * 100) / 100;
            percent.toFixed(2);
        }
        //console.log('percent: ', percent);
        res.status(200).json({ data: percent });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Tinh pham tram khach hang hien tai so voi tuan truoc
router.get('/cpanel/get-percent-customer', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const users = await user_controller.get_users();
        let total = 0;
        let totalLastWeek = 0;
        let date = new Date();
        let dateLastWeek = new Date();
        dateLastWeek.setDate(date.getDate() - 7);
        let dateLastWeek2 = new Date();
        dateLastWeek2.setDate(date.getDate() - 14);
        //console.log('dateStr: ', date + ' - ' + dateLastWeek + ' - ' + dateLastWeek2);
        for (let j = 0; j < users.length; j++) {
            if (users[j].role == 'user') {
                const dateRegister = new Date(users[j].dateRegister);
                if (dateRegister <= date && dateRegister >= dateLastWeek) {
                    total += 1;
                }
                if (dateRegister <= dateLastWeek && dateRegister >= dateLastWeek2) {
                    //console.log(dateRegister >= dateLastWeek2);
                    totalLastWeek += 1;
                }
            }
        }
        // console.log('total: ', total);
        // console.log('totalLastWeek: ', totalLastWeek);
        let percent = 0;
        if (totalLastWeek != 0) {
            percent = (total - totalLastWeek) / totalLastWeek * 100;
            percent = Math.round(percent * 100) / 100;
            percent.toFixed(2);
        }
        //console.log('percent: ', percent);
        res.status(200).json({ data: percent });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Tinh phan tram don hang hien tai so voi thang truoc
router.get('/cpanel/get-percent-order', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const orders = await order_controller.get_all_order();
        let total = 0;
        let totalLastMonth = 0;
        let date = new Date();
        let dateStr = date.getMonth() + 1 + '/' + date.getFullYear();
        let dateLastMonth = new Date();
        dateLastMonth.setMonth(dateLastMonth.getMonth() - 1);
        let dateStrLastMonth = dateLastMonth.getMonth() + 1 + '/' + dateLastMonth.getFullYear();
        //console.log('dateStr: ', dateStr + ' - ' + dateStrLastMonth);
        for (let j = 0; j < orders.length; j++) {
            if (orders[j].status == 'cart' || orders[j].status == 'favorite') {
                continue;
            } else {
                //console.log('order: ', orders[j]._id);
                //console.log('datePayment: ', orders[j].datePayment);
                if (orders[j].datePayment.includes(dateStr)) {
                    total += 1;
                    //console.log('datePayment: ', orders[j]._id);
                }
                if (orders[j].datePayment.includes(dateStrLastMonth)) {
                    totalLastMonth += 1;
                    //console.log('datePayment last: ', orders[j]._id);
                }
            }

        }
        // console.log('total: ', total);
        // console.log('totalLastMonth: ', totalLastMonth);
        let percent = 0;
        if (totalLastMonth != 0) {
            percent = (total - totalLastMonth) / totalLastMonth * 100;
            percent = Math.round(percent * 100) / 100;
            percent.toFixed(2);
        }
        //console.log('percent: ', percent);
        res.status(200).json({ data: percent });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Tinh phan tram don hang da ban hien tai so voi thang truoc
router.get('/cpanel/get-percent-order-sold', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const orders = await order_controller.get_all_order();
        let total = 0;
        let totalLastMonth = 0;
        let date = new Date();
        let dateStr = date.getMonth() + 1 + '/' + date.getFullYear();
        let dateLastMonth = new Date();
        dateLastMonth.setMonth(dateLastMonth.getMonth() - 1);
        let dateStrLastMonth = dateLastMonth.getMonth() + 1 + '/' + dateLastMonth.getFullYear();
        //console.log('dateStr: ', dateStr);
        for (let j = 0; j < orders.length; j++) {
            if (orders[j].status != 'Delivered') {
                continue;
            } else {
                if (orders[j].datePayment.includes(dateStr)) {
                    total++;
                }
                if (orders[j].datePayment.includes(dateStrLastMonth)) {
                    totalLastMonth++;
                }
            }
        }
        // console.log('total: ', total);
        // console.log('totalLastMonth: ', totalLastMonth);
        let percent = 0;
        if (totalLastMonth != 0) {
            percent = (total - totalLastMonth) / totalLastMonth * 100;
            percent = Math.round(percent * 100) / 100;
            percent.toFixed(2);
        }
        //console.log('percent: ', percent);
        res.status(200).json({ data: percent });
    } catch (error) {
        res.status(500).send(error.message);
    }
});





//----------------------------------category----------------------------------
//-Danh sach category
router.get('/categories', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const categories = await category_controller.get_all_category();
        if (!categories) {
            res.redirect('/');
            return;
        }
        res.render('categories', { title: 'iTech - Category', categories: categories });
    } catch (error) {
        console.log('Error get categories', error.message);
        res.redirect('/categories');
    }
});

//Cap nhat category theo id
router.get('/categories/:_id/update', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const categories = await category_controller.get_all_category();
        for (let i = 0; i < categories.length; i++) {
            if (categories[i]._id == req.params._id) {
                res.render('category-update', { title: 'iTech - Category', category: categories[i] });
                return;
            }
        }
    } catch (error) {
        console.log('Error get categories', error.message);
        res.redirect('/categories');
    }
});

router.post('/categories/:_id/update', checkAccessTokenMiddleware, multer.single('picture'), async function (req, res, next) {
    try {
        const { _id } = req.params;
        const { name } = req.body;
        let image = req.body.image;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            image = result.secure_url;
        }

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
        console.log('Error update category', error.message);
        res.redirect('/categories');
    }
});

//Xoa category theo id
router.get('/categories/:_id/delete', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const { _id } = req.params;
        if (!_id) {
            res.json({ status: false });
        } else {
            await category_controller.delete_category(_id);
            const brands = await brand_controller.get_brand_by_id_category(_id);
            for (let i = 0; i < brands.length; i++) {
                const products = await product_controller.onGetProductByIdBrand(brands[i]._id);
                for (let j = 0; j < products.length; j++) {
                    await product_controller.onDeleteProduct(products[j]._id);
                }
                await brand_controller.delete_brand(brands[i]._id);
            }

            res.json({ status: true });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Them category
router.get('/categories/insert', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        res.render('category-insert', { title: 'iTech - Category insert' });
    } catch (error) {
        console.log('Error get categories', error.message);
        res.redirect('/categories');
    }
});

router.post('/categories/insert', checkAccessTokenMiddleware, multer.single('picture'), async function (req, res, next) {
    try {
        const { name } = req.body;
        if (!req.file) {
            res.status(401).redirect('/categories/insert');
            return;
        }
        const result = await cloudinary.uploader.upload(req.file.path);
        const image = result.secure_url;
        //console.log('Info: ', name, image, idCategory, idBrand);
        if (!name || !image) {
            res.status(401).render('Error', { message: 'Not authorization' });
            return;
        }
        const category = await category_controller.add_category(name, image);
        if (!category) {
            res.status(401).render('Error', { message: 'Not authorization' });
            return;
        }
        res.redirect('/categories');

    } catch (error) {
        console.log('Error insert category', error.message);
        res.redirect('/categories');
    }
});




//----------------------------------Brand----------------------------------
//-Danh sach brand
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
        console.log('Error get brands', error.message);
        res.redirect('/brands');
    }
});

//Cap nhat brand theo id
router.get('/brands/:_id/update', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const brand = await brand_controller.get_brand_by_id(req.params._id);
        const categories = await category_controller.get_all_category();
        if (!brand || !categories) {
            res.status(401).render('Error', { message: 'Not authorization' });
            return;
        }
        if (categories) {
            for (let i = 0; i < categories.length; i++) {
                if (categories[i]._id == brand.idCategory) {
                    categories[i].isSelected = true;
                } else {
                    categories[i].isSelected = false;
                }
            }
        }
        res.render('brand-update', { title: 'iTech - Brand', brand: brand, categories: categories });
    } catch (error) {
        console.log('Error get brands', error.message);
        res.redirect('/brands');
    }
});

router.post('/brands/:_id/update', checkAccessTokenMiddleware, multer.single('picture'), async function (req, res, next) {
    try {
        const { _id } = req.params;
        const { name, idCategory } = req.body;
        let image = req.body.image;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            image = result.secure_url;
        }
        //console.log('Info: ', name, image, idCategory, idBrand);
        if (!name || !image || !_id || !idCategory) {
            res.status(401).render('Error', { message: 'Not authorization' });
            return;
        }
        const brand = await brand_controller.update_brand(_id, name, image, idCategory);
        if (!brand) {
            res.status(401).render('Error', { message: 'Not authorization' });
            return;
        }
        res.redirect('/brands');

    } catch (error) {
        console.log('Error update brand', error.message);
        res.redirect('/brands');
    }
});

//Xoa brand theo id
router.get('/brands/:_id/delete', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const { _id } = req.params;
        if (!_id) {
            res.json({ status: false });
        } else {
            const products = await product_controller.onGetProductByIdBrand(_id);
            for (let j = 0; j < products.length; j++) {
                await product_controller.onDeleteProduct(products[j]._id);
            }
            await brand_controller.delete_brand(_id);
            res.json({ status: true });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Them brands
router.get('/brands/insert', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const categories = await category_controller.get_all_category();
        res.render('brand-insert', { title: 'iTech - Brand insert', categories: categories });
    } catch (error) {
        console.log('Error get brands', error.message);
        res.redirect('/brands');
    }
});

router.post('/brands/insert', checkAccessTokenMiddleware, multer.single('picture'), async function (req, res, next) {
    try {
        const { name, idCategory } = req.body;
        let image = '';
        if (!req.file) {
            image = 'https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png';
        }else{
            const result = await cloudinary.uploader.upload(req.file.path);
            image = result.secure_url;
        }
        
        //console.log('Info: ', name, image, idCategory, idBrand);
        if (!name || !image || !idCategory) {
            res.status(401).redirect('/brands/insert')
            return;
        }
        const brand = await brand_controller.add_brand(name, image, idCategory);
        if (!brand) {
            res.status(401).render('Error', { message: 'Not authorization' });
            return;
        }
        res.redirect('/brands');
    } catch (error) {
        console.log('Error insert brand', error.message);
        res.redirect('/brands');
    }
});





//----------------------------------San pham----------------------------------
//-Danh sach san pham
router.get('/products', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const products = await product_controller.onGetProducts();
        if (!products) {
            res.status(401).render('Error', { message: 'Not authorization' });
            return;
        }
        for (let i = 0; i < products.length; i++) {
            const subProducts = await sub_product_controller.onGetSubProductsByIdProduct(products[i]._id);
            products[i].subProducts = subProducts;
            products[i].price = subProducts[0].price;
            products[i].sale = subProducts[0].sale;
        }

        res.render('products', { title: 'iTechPro - Product', products: products });
    } catch (error) {
        console.log('Error get products', error.message);
        res.redirect('/products');
    }
});

//Cap nhat san pham theo id
router.get('/products/:_id/product-update', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const products = await product_controller.onGetProducts();
        let product = null;
        if (!products) {
            res.status(401).render('Error', { message: 'Not authorization' });
            return;
        } else {
            for (let i = 0; i < products.length; i++) {
                if (products[i]._id == req.params._id) {
                    product = products[i];
                    break;
                }
            }
        }
        if (!product) {
            res.status(401).render('Error', { message: 'Not authorization' });
            return;
        }
        const subProducts = await sub_product_controller.onGetSubProductsByIdProduct(req.params.id);
        product.subProducts = subProducts;

        //Lay danh sach danh muc
        const categories = await category_controller.get_all_category();
        if (categories) {
            for (let i = 0; i < categories.length; i++) {
                if (categories[i]._id == product.idCategory) {
                    categories[i].isSelected = true;
                } else {
                    categories[i].isSelected = false;
                }
            }
        }

        //Lay danh sach thuong hieu
        const brands = await brand_controller.get_brand_by_id_category(product.idCategory);
        if (brands) {
            for (let i = 0; i < brands.length; i++) {
                if (brands[i]._id == product.idBrand) {
                    brands[i].isSelected = true;
                } else {
                    brands[i].isSelected = false;
                }
            }
        }
        const title = 'iTechPro - Product Update';
        res.render('product-update', { title, product, brands, categories });
    } catch (error) {
        console.log('Error update product', error.message);
        res.redirect('/products');
    }
});

router.post('/products/:_id/product-update', checkAccessTokenMiddleware, multer.single('image'), async function (req, res, next) {
    try {
        const { _id } = req.params;
        const { name, idCategory, idBrand } = req.body;
        const result = await cloudinary.uploader.upload(req.file.path);
        const image = result.secure_url;
        //console.log('Info: ', name, image, idCategory, idBrand);
        if (!name || !image || !idCategory || !idBrand) {
            res.status(401).render('Error', { message: 'Not authorization' });
            return;
        }
        const product = await product_controller.onUpdateProduct(_id, name, image, idCategory, idBrand);
        if (!product) {
            res.status(401).render('Error', { message: 'Not authorization' });
            return;
        }
        res.redirect('/products');
    } catch (error) {
        console.log('Error update product', error.message);
        res.redirect('/products');
    }
});

//Them san pham
router.get('/products/product-insert', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        //Lay danh sach danh muc
        const categories = await category_controller.get_all_category();
        //console.log('categories: ', categories);
        //Lay danh sach thuong hieu
        let listBrands = [];
        if (categories) {
            for (let i = 0; i < categories.length; i++) {
                const brands = await brand_controller.get_brand_by_id_category(categories[i]._id);
                if (brands) {
                    for (let j = 0; j < brands.length; j++) {
                        listBrands.push(brands[j]);
                    }
                }
            }
        }
        const title = 'iTechPro - Product Add';
        res.render('product-insert', { title, categories, brands: listBrands });
    } catch (error) {
        console.log('Error insert product', error.message);
        res.redirect('/products');
    }
});

router.post('/products/product-insert', checkAccessTokenMiddleware, multer.single('picture'), async function (req, res, next) {
    try {
        const {
            name, idCategory, idBrand, price, description, quantity, color, sale, ram, rom, cpu, screen
        } = req.body
        const result = await cloudinary.uploader.upload(req.file.path);
        const image = result.secure_url;
        if (!image) {
            res.status(401).render('Error', { message: 'Upload image fail' });
            return;
        }
        const product = await product_controller.onAddroduct(name, image, idCategory, idBrand);
        const subProduct = await sub_product_controller
            .onAddSubProduct(price, description, quantity, color, sale, ram, rom, screen, cpu, "", "", "", product._id);
        await picture_controller.add_picture(image, subProduct._id, "", "");
        res.redirect('/products');
    } catch (error) {
        console.log('Error insert product', error.message);
        res.redirect('/products');
    }
});

//Xoa san pham
router.get('/products/:_id/delete', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const { _id } = req.params;
        const result = await product_controller.onDeleteProduct(_id);
        console.log('Result delete product: ', result);
        res.json({status: result})
    } catch (error) {
        console.log('Error delete product', error.message);
        res.redirect('/products');
    }
});





//-------------------------------------------San pham chi tiet-----------------------------------
//Lay danh sach san pham chi tiet
router.get('/sub-product', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const subProducts = await sub_product_controller.onGetSubProducts();
        if (subProducts) {
            for (let i = 0; i < subProducts.length; i++) {
                const product = await product_controller.onGetProductById(subProducts[i].idProduct);
                if (product) {
                    subProducts[i].nameProduct = product.name;
                    subProducts[i].image = product.image;
                }
            }

            res.render('sub-product', { title: 'iTechPro - Sub Product', subProducts });

        } else {
            res.status(401).render('Error', { message: 'Not authorization' });
            return;
        }
    } catch (error) {
        console.log('Error get sub product', error.message);
        res.redirect('/sub-product');
    }
});

//Them san pham chi tiet
router.get('/sub-products/sub-product-insert', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const products = await product_controller.onGetProducts();
        if (products) {
            res.render('sub-product-insert', { title: 'iTech - Thêm sản phẩm chi tiết', products });
        } else {
            res.status(401).render('Error', { message: 'Not authorization' });
            return;
        }
    } catch (error) {
        console.log('Error insert sub product', error.message);
        res.redirect('/sub-products/sub-product-insert');
    }
});

router.post('/sub-products/sub-product-insert', checkAccessTokenMiddleware, multer.array('pictures', 10), async function (req, res, next) {
    try {
        const { idProduct, price, description, quantity, color, sale, ram, rom, screen, cpu } = req.body;
        const subProduct = await sub_product_controller
            .onAddSubProduct(price, description, quantity, color, sale, ram, rom, screen, cpu, "", "", "", idProduct);
        if (!subProduct) {
            res.status(401).render('Error', { message: 'Not authorization' });
            return;
        }
        const files = req.files;
        if (!files) {
            res.status(401).render('Error', { message: 'Not authorization' });
            return;
        }
        for (let i = 0; i < files.length; i++) {
            const result = await cloudinary.uploader.upload(files[i].path);
            const image = result.secure_url;
            await picture_controller.add_picture(image, subProduct._id, "", "");
        }
        res.redirect('/sub-product');
    } catch (error) {
        console.log('Error insert sub product', error.message);
        res.redirect('/sub-products/sub-product-insert');
    }
});

//Cap nhat san pham chi tiet
router.get('/sub-products/:_id/sub-product-update', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const { _id } = req.params;
        const subProducts = await sub_product_controller.onGetSubProducts();
        if (!subProducts) {
            return;
        }
        let subProduct = null;
        for (let i = 0; i < subProducts.length; i++) {
            if (subProducts[i]._id == _id) {
                subProduct = subProducts[i];
            }
        }

        const product = await product_controller.onGetProductById(subProduct.idProduct);
        //console.log('Product update subProduct', product);

        if (product) {
            res.render('sub-product-update', { title: 'iTechPro - Product', product, subProduct });
        } else {
            res.status(401).render('Error', { message: 'Not authorization' });
            return;
        }
    } catch (error) {
        console.log('Error update sub product', error.message);
        res.redirect('/sub-product');
    }
});

router.post('/sub-products/:_id/sub-product-update', checkAccessTokenMiddleware, multer.array('pictures', 10), async function (req, res, next) {
    try {
        const { price, ram, rom, quantity, sale, cpu, screen, subProduct } = req.body;
        const { _id } = req.params;
        const files = req.files; // Danh sách các tệp đã được tải lên
        const result = await Promise.all(
            files.map(async (file) => {
                const uploadResult = await cloudinary.uploader.upload(file.path);
                return uploadResult.secure_url;
            })
        );
        console.log('Result', result);
        //Them hinh anh
        for (let i = 0; i < result.length; i++) {
            const picture = await picture_controller.add_picture(result[i], _id, "", "");
            console.log('Picture', picture);
        }
        //cap nhat subProduct
        const subProductUpdate = await sub_product_controller
            .onUpdateSubProduct(_id, price, subProduct.description, quantity, subProduct.color,
                sale, ram, rom, screen, cpu, subProduct.pin, "", "", subProduct.idProduct);

        if (!subProductUpdate) {
            res.status(401).render('Error', { message: 'Not authorization' });
            return;
        } else {
            res.redirect('/products');
        }

    } catch (error) {
        console.log('Error update sub product', error.message);
        res.redirect('/sub-product');
    }
});

//Xoa san pham chi tiet
router.get('/sub-products/:_id/delete', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const { _id } = req.params;
        const result = await sub_product_controller.onDeleteSubProduct(_id);
        console.log('Result delete sub product', result);
        res.json({ status: result });
    } catch (error) {
        console.log('Error delete sub product', error.message);
        res.redirect('/sub-product');
    }
});




//-------------------------------------------Don hang-----------------------------------
//Lay danh sach don hang
router.get('/orders', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const orders = await order_controller.get_all_order();

        if (orders) {
            let list = [];
            for (let i = 0; i < orders.length; i++) {
                if (orders[i].status == 'cart' || orders[i].status == 'favorite') {
                    continue;
                } else {
                    const user = await user_controller.get_user(orders[i].idUser);
                    orders[i].nameUser = user.name;
                    orders[i].avatarUser = user.avatar;
                    orders[i].phoneUser = user.numberPhone;
                    list.push(orders[i]);
                }
            }
            res.render('orders', { title: 'iTech - Orders', orders: list });
        } else {
            res.status(401).render('error', { message: 'Not authorization' });
            return;
        }
    } catch (error) {
        console.log('Error get all order', error.message);
        res.redirect('/orders');
    }
});

//Cap nhat don hang (XAc nhan/ Huy don hang)
router.get('/orders/:_idOrder/update', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const { _idOrder } = req.params;
        //Lay chi tiet don hang
        const orderDetails = await order_detail_controller.get_order_detail_by_idOrder(_idOrder);
        if (!orderDetails) {
            return res.status(401).render('error', { message: 'Not authorization' });
        }
        //Cap nhat so luong san pham
        for (let i = 0; i < orderDetails.length; i++) {
            const subProduct = await sub_product_controller.onGetSubProductById(orderDetails[i].idSubProduct);
            if (!subProduct) {
                return res.status(401).render('error', { message: 'Not authorization' });
            }
            if (subProduct.quantity < orderDetails[i].quantity) {
                return res.status(401).render('error', { message: 'Not authorization' });
            }
            await sub_product_controller.onUpdateQuantitySubProduct(orderDetails[i].idSubProduct, subProduct.quantity - orderDetails[i].quantity);
        }

        //Cap nhat don hang
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const dayNow = day + '/' + month + '/' + year;
        const orderUpdate = await order_controller.update_order(_idOrder, dayNow, 'Delivered');
        if (!orderUpdate) {
            return res.status(401).render('error', { message: 'Not authorization' });
        }

        //Gui thong bao den nguoi dung
        const data = {
            title: 'iTech - Order',
            body: `Đơn hàng ${_idOrder} đã được xác nhận`,
            image: ''
        }
        await notification.onSendData(orderUpdate.idUser, data);

        return res.redirect('/orders');
    } catch (error) {
        console.log('Error update order', error.message);
        res.redirect('/orders');
    }
});

//Huy don hang
router.get('/orders/:_idOrder/cancel', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const { _idOrder } = req.params;
        //Lay chi tiet don hang
        const orderDetails = await order_detail_controller.get_order_detail_by_idOrder(_idOrder);
        if (!orderDetails) {
            return res.status(401).render('error', { message: 'Not authorization' });
        }
        //Cap nhat trang thai don hang
        //Cap nhat don hang
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const dayNow = day + '/' + month + '/' + year;
        const orderUpdate = await order_controller.update_order(_idOrder, dayNow, 'Canceled');

        //Gui thong bao den nguoi dung
        const data = {
            title: 'iTech - Order',
            body: `Đơn hàng ${_idOrder} đã huỷ`,
            image: ''
        }
        await notification.onSendData(orderUpdate.idUser, data);

        return res.redirect('/orders');
    } catch (error) {
        console.log('Error update order', error.message);
        res.redirect('/orders');
    }
});





//-----------------------------Don hang chi tiet----------------------------------
//Lay danh sach don hang chi tiet
router.get('/orders/:_idOrder/order-detail', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const { _idOrder } = req.params;
        const order = await order_controller.get_order_by_id(_idOrder);
        if (!order) {
            return res.status(401).render('error', { message: 'Not authorization' });
        }
        const user = await user_controller.get_user(order.idUser);
        if (!user) {
            return res.status(401).render('error', { message: 'Not authorization' });
        }
        //Lay danh sach don hang chi tiet
        const orderDetails = await order_detail_controller.get_order_detail_by_idOrder(_idOrder);
        if (!orderDetails) {
            return res.status(401).render('error', { message: 'Not authorization' });
        }
        //Lay san pham theo idOrderDetail
        let list = [];
        let total = 0;
        let totalSale = 0;
        for (let i = 0; i < orderDetails.length; i++) {
            const subProduct = await sub_product_controller.onGetSubProductById(orderDetails[i].idSubProduct);
            if (!subProduct) {
                return res.status(401).render('error', { message: 'Not authorization' });
            }

            const product = await product_controller.onGetProductById(subProduct.idProduct);
            if (!product) {
                return res.status(401).render('error', { message: 'Not authorization' });
            }
            //console.log('SubProduct', subProduct.price);
            list.push(
                {
                    image: product.image,
                    color: subProduct.color,
                    nameProduct: product.name,
                    priceProduct: subProduct.price,
                    priceSale: subProduct.price - subProduct.price * subProduct.sale / 100,
                    quantity: orderDetails[i].quantity,
                    inventory: subProduct.quantity,
                }
            );
            total += subProduct.price * orderDetails[i].quantity;
            totalSale += (subProduct.price - subProduct.price * subProduct.sale / 100) * orderDetails[i].quantity;
        }
        //console.log('List', list);
        order.total = total;
        order.totalSale = totalSale;
        order.codeSale = order.totalPrice - order.totalSale;
        if (order.status == 'Delivered' || order.status == 'Canceled') {
            order.check = false;
        } else {
            order.check = true;
        }

        res.render('order-detail', { title: 'iTech - Order detail', order, orderDetails: list, user });
    } catch (error) {
        console.log('error: ', error);
        res.redirect('/orders');
    }
});





//-----------------------------Customer----------------------------------
//Lay danh sach khach hang
router.get('/customers', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        let list = [];
        const customers = await user_controller.get_users();
        for (let i = 0; i < customers.length; i++) {
            if (customers[i].role == 'user') {
                list.push(customers[i]);
                const address = await address_controller.get_address_by_idUser(customers[i]._id);
                if (!address) {
                    return res.status(401).render('error', { message: 'Not authorization' });
                }
                for (let j = 0; j < address.length; j++) {
                    if (address[j].status == true) {
                        customers[i].address = address[j].body;
                        break;
                    }
                }
            }

        }

        if (!customers) {
            return res.status(401).render('error', { message: 'Not authorization' });
        }
        res.render('customers', { title: 'iTech - Customers', customers: list });
    } catch (error) {
        console.log('Get customers error: ', error);
        res.redirect('/customers');
    }
});






//-----------------------------Profile----------------------------------
router.get('/profile', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        //console.log(req.session.user._id);
        const userId = req.session.user._id;
        let user = await user_controller.get_user(userId);
        const address = await address_controller.get_address_by_idUser(userId);
        if (address) {
            for (let i = 0; i < address.length; i++) {
                if (address[i].status == true) {
                    user.address = address[i].body;
                    break;
                }
            }
        }
        //console.log('User', user);
        res.render('profile', { title: 'iTech - Profile', user });
    } catch (error) {
        res.redirect('/profile');
    }
});

router.post('/profile/update', checkAccessTokenMiddleware, multer.single('picture'), async function (req, res, next) {
    try {
        const { _id, email, name, birthday, numberPhone, address } = req.body;
        //_idUser, email, name, birthday, numberPhone, avatar
        let avatar = '';
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            avatar = result.secure_url;
        } else {
            avatar = req.session.user.avatar;
        }
        console.log('Avatar', avatar);
        const user = await user_controller.update_user(_id, email, name, birthday, numberPhone, avatar);
        if (!user) {
            console.log('Error update user');
            return res.redirect('/profile');
        }
        //console.log('User: ', user);
        //res.session.user = user;
        //console.log('User req.session: ', req.session.user);
        //_id, body, status, numberPhone, idUser
        const listddress = await address_controller.get_address_by_idUser(_id);
        if (listddress) {
            for (let i = 0; i < listddress.length; i++) {
                if (listddress[i].status == true) {
                    const addressUpdate = await address_controller.update_address(listddress[i]._id, address, true, numberPhone, _id);
                    if (!addressUpdate) {
                        console.log('Error update address');
                        return res.redirect('/profile');
                    }
                    break;
                }
            }
        }
        res.redirect('/profile');
    } catch (error) {
        console.log('Error update profile', error.message);
        res.redirect('/profile');
    }
});





//-----------------------------Search----------------------------------
router.get('/search', checkAccessTokenMiddleware, async function (req, res, next) {
    try {
        const { keyword, name } = req.query;
        if (name == 'category') {
            const categories = await category_controller.get_all_category();
            //Lay categories theo keyword
            let listCate = [];
            for (let i = 0; i < categories.length; i++) {
                if (categories[i].name.toLowerCase().includes(keyword.toLowerCase())) {
                    listCate.push(categories[i]);
                }
            }
            res.render('categories', { title: 'iTech - Categories', categories: listCate });
        } else if (name == 'brand') {
            const brands = await brand_controller.get_all_brand();
            //Lay brands theo keyword
            let listBrand = [];
            for (let i = 0; i < brands.length; i++) {
                if (brands[i].name.toLowerCase().includes(keyword.toLowerCase())) {
                    const category = await category_controller.get_category_by_id(brands[i].idCategory);
                    brands[i].nameCategory = category.name;
                    listBrand.push(brands[i]);
                }
            }
            res.render('brands', { title: 'iTech - Brands', brands: listBrand });
        } else if (name == 'customer') {
            const customers = await user_controller.get_users();
            //Lay customers theo keyword
            let listCustomer = [];
            for (let i = 0; i < customers.length; i++) {
                if (customers[i].role == 'user') {
                    if (customers[i].name.toLowerCase().includes(keyword.toLowerCase())) {
                        const address = await address_controller.get_address_by_idUser(customers[i]._id);
                        if (!address) {
                            return res.redirect('/customers');
                        }
                        for (let j = 0; j < address.length; j++) {
                            if (address[j].status == true) {
                                customers[i].address = address[j].body;
                                break;
                            }
                        }
                        listCustomer.push(customers[i]);
                    }
                }

            }
            res.render('customers', { title: 'iTech - Customers', customers: listCustomer });
        } else if (name == 'product') {
            const products = await product_controller.onGetProducts();
            //Lay products theo keyword
            let listProduct = [];
            for (let i = 0; i < products.length; i++) {
                if (products[i].name.toLowerCase().includes(keyword.toLowerCase())) {
                    const subProducts = await sub_product_controller.onGetSubProductsByIdProduct(products[i]._id);
                    products[i].subProducts = subProducts;
                    products[i].price = subProducts[0].price;
                    products[i].sale = subProducts[0].sale;
                    listProduct.push(products[i]);
                }
            }
            res.render('products', { title: 'iTech - Products', products: listProduct });
        } else if (name == 'sub-product') {
            const sub_products = await sub_product_controller.onGetSubProducts();
            //Lay sub_products theo keyword
            let listSubProduct = [];
            for (let i = 0; i < sub_products.length; i++) {
                const product = await product_controller.onGetProductById(sub_products[i].idProduct);
                if (product) {
                    if(product.name.toLowerCase().includes(keyword.toLowerCase())){
                        sub_products[i].nameProduct = product.name;
                        sub_products[i].image = product.image;
                        listSubProduct.push(sub_products[i]);
                    }
                }
            }
            res.render('sub-product', { title: 'iTech - Sub Products', subProducts: listSubProduct });
        } else if (name == 'order') {
            const orders = await order_controller.get_all_order();
            //Lay orders theo keyword
            let listOrder = [];
            for (let i = 0; i < orders.length; i++) {
                if (orders[i].status == 'cart' || orders[i].status == 'favorite') {
                    continue;
                } else {
                    let id = orders[i]._id.toString();
                    if (id.toLowerCase().includes(keyword.toLowerCase())) {
                        const user = await user_controller.get_user(orders[i].idUser);
                        orders[i].nameUser = user.name;
                        orders[i].avatarUser = user.avatar;
                        orders[i].phoneUser = user.numberPhone;
                        listOrder.push(orders[i]);
                    }
                }

            }
            res.render('orders', { title: 'iTech - Orders', orders: listOrder });
        } else {
            return res.redirect('/home');
        }
    } catch (error) {
        console.log('Get search error: ', error);
        res.redirect('/home');
    }
});



//Xoa hinh anh
router.get('/cpanel/delete-image', async function (req, res, next) {
    try {
        await picture_controller.deletePictures();
        res.json({ data: true });
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;