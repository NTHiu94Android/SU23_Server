const express = require('express');
const router = express.Router();
const review_controller = require('../models/review/reviewController');

const authen = require('../middleware/auth');

//Them review
router.post('/api/add-review', authen, async (req, res) => {
    try {
        const review = await review_controller.add_review(
            req.body.time, req.body.content, req.body.rating, req.body.idUser, req.body.idProduct
        );
        res.json({ error: false, responeTime: new Date(), statusCode: 200, data: review });
    } catch (error) {
        res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
    }
});

//Lat tat ca review
router.get('/api/get-all-review', authen, async (req, res) => {
    try {
        const reviews = await review_controller.get_all_review();
        res.json({ error: false, responeTime: new Date(), statusCode: 200, data: reviews });
    } catch (error) {
        res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
    }
});

//Lay review theo idProduct
router.get('/api/get-review-by-idProduct/:idProduct', authen, async (req, res) => {
    try {
        const { idProduct } = req.params;
        const review = await review_controller.get_review_by_idProduct(idProduct);
        res.json({ error: false, responeTime: new Date(), statusCode: 200, data: review });
    } catch (error) {
        res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
    }
});

module.exports = router;