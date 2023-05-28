var express = require('express');
var router = express.Router();
const authen = require('../middleware/auth');
const order_controller = require('../models/order/orderController');

//Tạo order
//http://localhost:3000/order/api/create-order
router.post('/api/add-order', [authen], async function (req, res, next) {
    try {
        const { dateCreate, datePayment, totalPrice, status, paymentMethod, address, idUser } = req.body;
        const order = await order_controller
            .add_order(dateCreate, datePayment, totalPrice, status, paymentMethod, address, idUser);
        res.json({ error: false, responeTime: new Date(), statusCode: 200, data: order });
    } catch (error) {
        res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
    }
});

//Lấy order theo idUser
//http://localhost:3000/order/api/get-order-by-idUser/:idUser
router.get('/api/get-orders-by-idUser/:idUser', [authen], async function (req, res, next) {
    try {
        const { idUser } = req.params;
        const order = await order_controller.get_order_by_idUser(idUser);
        res.json({ error: false, responeTime: new Date(), statusCode: 200, data: order });
    } catch (error) {
        res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
    }
});

//Cập nhật order
router.post('/api/update-order', [authen], async function (req, res, next) {
    try {
        const { _id, datePayment, status } = req.body;
        const order = await order_controller
            .update_order( _id, datePayment, status);
        res.json({ error: false, responeTime: new Date(), statusCode: 200, data: order });
    } catch (error) {
        res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
    }
});

module.exports = router;
