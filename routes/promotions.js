const express = require('express');
const router = express.Router();
const promotion_controller = require('../models/promotion/promotionController');

const authen = require('../middleware/auth');

//---------------------------------USER---------------------------------
//Lay promotion theo idUser
router.get('/api/get-all-promotion-by-id-user/:idUser', [authen], async (req, res) => {
    try {
        const { idUser } = req.params;
        const promotions = await promotion_controller.getAllPromotionByIdUser(idUser);
        res.json({ error: false, responeTime: new Date(), statusCode: 200, data: promotions });
    } catch (error) {
        res.json({ error: true, responeTime: new Date(), statusCode: 400, data: error.message });
    }
});

// add promotion
router.post('/api/add-promotion', [authen], async (req, res) => {
    try {
        const { content, sale, code, dayStart, dayEnd, condition, idUser } = req.body;
        const promotion = await promotion_controller.addPromotion(content, sale, code, dayStart, dayEnd, condition, idUser);
        res.json({ error: false, responeTime: new Date(), statusCode: 200, data: promotion });
    } catch (error) {
        res.json({ error: true, responeTime: new Date(), statusCode: 400, data: error.message });
    }
});

// update promotion submit by id
router.post('/api/update-promotion-submit', [authen], async (req, res) => {
    try {
        const { _id, isSubmit } = req.body;
        const promotion = await promotion_controller.updatePromotionSubmit(_id, isSubmit);
        res.json({ error: false, responeTime: new Date(), statusCode: 200, data: promotion });
    } catch (error) {
        res.json({ error: true, responeTime: new Date(), statusCode: 400, data: error.message });
    }
});


//---------------------------------ADMIN---------------------------------
// delete promotion
router.delete('/cpanel/delete-promotion/:_id', [authen], async (req, res) => {
    try {
        const { _id } = req.params;
        await promotion_controller.deletePromotion(_id);
    } catch (error) {
        res.json({ error: true, responeTime: new Date(), statusCode: 400, data: error.message });
    }
});


module.exports = router;