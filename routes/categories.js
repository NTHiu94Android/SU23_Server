var express = require('express');
var router = express.Router();
const category_controller = require('../models/category/categoryController');
const authen = require('../middleware/auth');


//Lay tat ca category
//http://localhost:3000/category/api/get-all-category
router.get('/api/get-all-category', [authen], async (req, res) => {
    try {
        const categories = await category_controller.get_all_category();
        res.json({ error: false, responeTime: new Date(), statusCode: 200, data: categories });
    } catch (error) {
        res.json({ error: true, responeTime: new Date(), statusCode: 400, data: error.message });
    }
});

//Them category
//http://localhost:3000/category/cpanel/add-category
router.post('/cpanel/add-category', [authen], async (req, res) => {
    try {
        const { name, image } = req.body;
        const category = await category_controller.add_category(name, image);
        res.json({ error: false, responeTime: new Date(), statusCode: 200, data: category });
    } catch (error) {
        res.json({ error: true, responeTime: new Date(), statusCode: 400, data: error.message });
    }
});

module.exports = router;