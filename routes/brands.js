const express = require('express');
const router = express.Router();
const brand_controller = require('../models/brand/brandController');

const authen = require('../middleware/auth');

//Lay brand theo idCategory
router.get('/api/get-brand-by-id-category/:idCategory', [authen], async (req, res) => {
    try {
        const brands = await brand_controller.get_brand_by_id_category(req.params.idCategory);
        res.json({ error: false, responeTime: new Date(), statusCode: 200, data: brands });
    } catch (error) {
        res.json({ error: true, responeTime: new Date(), statusCode: 400, data: error.message });
    }
});

// add brand
//http://localhost:5000/brand/cpanel/add-brand
router.post('/cpanel/add-brand', [authen], async (req, res) => {
    try {
        const { name, image, idCategory } = req.body;
        const brand = await brand_controller.add_brand(name, image, idCategory);
        res.json({ error: false, responeTime: new Date(), statusCode: 200, data: brand });
    } catch (error) {
        res.json({ error: true, responeTime: new Date(), statusCode: 400, data: error.message });
    }
});

module.exports = router;