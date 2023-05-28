var express = require('express');
var router = express.Router();

const cloudinary = require('cloudinary').v2;

const multer = require('../middleware/multer');
const authen = require('../middleware/auth');

const picture_controller = require('../models/picture/pictureController');

//Lay tat ca picture
//http://localhost:3000/picture/api/get-all-picture
router.get('/api/get-all-picture', [authen], async (req, res) => {
   try{
      const pictures = await picture_controller.get_all_picture();
      res.json({ error: false, responeTime: new Date(), statusCode: 200, data: pictures });
   }catch(error){
      console.log('Error get all picture: ' + error.message);
   }
});

//Lay picture theo id
//http://localhost:3000/picture/api/get_picture_by_id/5f9f1b0b0b2b2c2b8c8c8c8c
router.get('/api/get-picture-by-id/:id', [authen], async (req, res) => {
   try{
      const id = req.params.id;
      const picture = await picture_controller.get_picture(id);
      res.json({ error: false, responeTime: new Date(), statusCode: 200, data: picture });
   }catch(error){
      console.log('Error get picture by id: ' + error.message);
   }
});

//Lay pictures theo idProduct
//http://localhost:3000/picture//get-pictures-by-idProduct/5f9f1b0b0b2b2c2b8c8c8c8c
router.get('/api/get-pictures-by-idSubProduct/:idSubProduct', [authen], async (req, res) => {
   try{
      const idSubProduct = req.params.idSubProduct;
      const pictures = await picture_controller.get_pictures_by_idProduct(idSubProduct);
      res.json({ error: false, responeTime: new Date(), statusCode: 200, data: pictures });
   }catch(error){
      console.log('Error get pictures by idProduct: ' + error.message);
   }
});

//Lay pictures theo idReview
//http://localhost:3000/picture//get-pictures-by-idReview/5f9f1b0b0b2b2c2b8c8c8c8c
router.get('/api/get-pictures-by-idReview/:idReview', [authen], async (req, res) => {
    try{
        const idReview = req.params.idReview;
        const pictures = await picture_controller.get_pictures_by_idReview(idReview);
        res.json({ error: false, responeTime: new Date(), statusCode: 200, data: pictures });
    }catch(error){
        console.log('Error get pictures by idReview: ' + error.message);
    }
});

// Them picture
//http://localhost:3000/picture/api/add-picture
router.post('/api/add-picture', async (req, res) => {
   try{
      const { url, idSubProduct, idReview } = req.body;
      const picture = await picture_controller.add_picture(url, idSubProduct, idReview);
      res.json({ error: false, responeTime: new Date(), statusCode: 200, data: picture });
   }catch(error){
      console.log('Error add picture: ' + error.message);
   }
});

//Upload picture
//http://localhost:3000/pictures/api/upload-picture
router.post('/api/upload-picture', multer.single('picture'), async function (req, res) {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        res.json({ error: true, responeTime: new Date(), statusCode: 500, data: result.secure_url });
    } catch (error) {
        console.log(error);
        res.json({ error: true, responeTime: new Date(), statusCode: 500, message: error.message });
    }
});


module.exports = router;




