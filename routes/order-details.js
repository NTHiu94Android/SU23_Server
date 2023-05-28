const express = require('express');
const router = express.Router();
const order_detail_controller = require('../models/order-detail/orderDetailController');

const authen = require('../middleware/auth');

//Lay order_detail theo idOrder
router.get('/api/get-order-detail-by-idOrder/:idOrder', authen, async (req, res) => {
    try {
        const order_details = await order_detail_controller
            .get_order_detail_by_idOrder(req.params.idOrder);
        res.json({ error: false, responeTime: new Date(), statusCode: 200, data: order_details });
    } catch (error) {
        res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
    }
});

//Lay tat ca order_detail
router.get('/api/get-all-order-detail', authen, async (req, res) => {
    try {
        const order_details = await order_detail_controller.get_all_order_detail();
        res.json({ error: false, responeTime: new Date(), statusCode: 200, data: order_details });
    } catch (error) {
        res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
    }
});

//Add order_detail
router.post('/api/add-order-detail', authen, async (req, res) => {
    try {
        const order_detail = await order_detail_controller
            .add_order_detail(req.body.quantity, req.body.price, req.body.idOrder, req.body.idSubProduct);
        res.json({ error: false, responeTime: new Date(), statusCode: 200, data: order_detail });
    } catch (error) {
        res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
    }
});

//Delete order_detail
router.get('/api/delete-order-detail/:id', authen, async (req, res) => {
    try {
        const response = await order_detail_controller.delete_order_detail(req.params.id);
        res.json({ error: false, responeTime: new Date(), statusCode: 200, data: response });
    } catch (error) {
        res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
    }
});

//Update order_detail
router.post('/api/update-order-detail', authen, async (req, res) => {
    try {
        const { _id, quantity, price, isCmt, idOrder, idSubProduct } = req.body;
        const order_detail_update = await order_detail_controller
            .update_order_detail(_id, quantity, price, isCmt, idOrder, idSubProduct);
        res.json({ error: false, responeTime: new Date(), statusCode: 200, data: order_detail_update });
    } catch (error) {
        res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
    }
});

module.exports = router;