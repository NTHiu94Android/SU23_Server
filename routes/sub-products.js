var express = require('express');
var router = express.Router();
const sub_product_controller = require('../models/sub-product/subProductController');

const authen = require('../middleware/auth');

//----------------------Api-----------------------------------------

//Lay tat ca subProducts
router.get('/api/get-all-sub-products', [authen], async (req, res) => {
    try {
        const subProducts = await sub_product_controller.onGetSubProducts();
        res.json({ error: false, responeTime: new Date(), statusCode: 200, data: subProducts });
    } catch (error) {
        res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
    }
});

//Lay subProducts theo idProduct
router.get('/api/get-sub-products-by-id-product/:idProduct', [authen], async (req, res) => {
    try {
        const idProduct = req.params.idProduct;
        const subProducts = await sub_product_controller.onGetSubProductsByIdProduct(idProduct);
        res.json({ error: false, responeTime: new Date(), statusCode: 200, data: subProducts });
    } catch (error) {
        res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
    }
});

//Cap nhat subProduct
router.post('/api/update-sub-product', [authen], async (req, res) => {
    try {
        const {_id, description} = req.body;
        const subProduct = await sub_product_controller.onUpdateSubProduct(_id, description);
        res.json({ error: false, responeTime: new Date(), statusCode: 200, data: subProduct });
    } catch (error) {
        res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
    }
});

//----------------------Admin cpanel (res.render)-----------------------------------------
//Cap nhat subProduct
router.post('/cpanel/update-sub-product', [authen], async (req, res) => {
    try {
        const {
            _id, price, description, quantity, color, sale,
            ram, rom, screen, cpu, pin, front_camera, back_camera, idProduct
        } = req.body;
        const subProduct = await sub_product_controller.onUpdateSubProduct(
            _id, price, description, quantity, color, sale,
            ram, rom, screen, cpu, pin, front_camera, back_camera, idProduct
        );
        res.json({ error: false, responeTime: new Date(), statusCode: 200, data: subProduct });
    } catch (error) {
        console.log('Error update product: ' + error.message);
    }
});

//Add subProduct
router.post('/cpanel/add-sub-product', async (req, res) => {
    try {
        const {
            price, description, quantity, color, sale,
            ram, rom, screen, cpu, pin, front_camera, back_camera, idProduct
        } = req.body;
        const subProduct = await sub_product_controller.onAddSubProduct(
            price, description, quantity, color, sale,
            ram, rom, screen, cpu, pin, front_camera, back_camera, idProduct
        );
        res.json({ error: false, responeTime: new Date(), statusCode: 200, data: subProduct });
    } catch (error) {
        console.log('Error add product: ' + error.message);
    }
});



module.exports = router;
