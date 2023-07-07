const picture_model = require('../picture/pictureModel');

//Lay tat ca picture
const get_all_picture = async () => {
    const pictures = await picture_model.find({});
    return pictures;
};

//Xoa picture
const deletePictures = async () => {
    //await picture_model.deleteMany({url: url});
    const pictures = await picture_model.find({});
    for (let i = 0; i < pictures.length; i++) {
        if(pictures[i].url == null || pictures[i].url == undefined){
            await picture_model.deleteOne({_id: pictures[i]._id});
        }
    }
    
}

//Lay picture theo id
const get_picture = async (_idPic) => {
    const picture = await picture_model.findById(_idPic);
    return picture;
};

//Lay pictures theo idSubProduct
const get_pictures_by_idProduct = async (idSubProduct) => {
    const pictures = await picture_model.find({ idSubProduct: idSubProduct });
    return pictures;
};

//Lay pictures theo idReview
const get_pictures_by_idReview = async (idReview) => {
    const pictures = await picture_model.find({ idReview: idReview });
    return pictures;
};

// Them picture
const add_picture = async (url, idSubProduct, idReview) => {
    const picture = new picture_model({ url, idSubProduct, idReview });
    await picture.save();
    return picture;
};

module.exports = { 
    add_picture, get_picture, get_pictures_by_idProduct, get_pictures_by_idReview, get_all_picture, deletePictures
};