var express = require('express');
var router = express.Router();
const product_controller = require('../models/product/productController');

const authen = require('../middleware/auth');

//Lấy tất cả sản phẩm
//http://localhost:3000/product/api/get-products
router.get('/api/get-products', [authen], async function (req, res, next) {
    try {
        const products = await product_controller.onGetProducts();
        res.json({ error: false, responeTime: new Date(), statusCode: 200, data: products });
    } catch (error) {
        res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
    }
});

//----------------------CPANEL----------------------//

//Thêm sản phẩm
//http://localhost:3000/product/cpanel/add-product
router.post('/cpanel/add-product', [authen], async function (req, res, next) {
    try {
        const {name, image, idCategory, idBrand} = req.body;
        const product = await product_controller.onAddroduct(name, image, idCategory, idBrand);
        res.json({ error: false, responeTime: new Date(), statusCode: 200, data: product });
    } catch (error) {
        res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
    }
});


module.exports = router;
