const picture_service = require('../picture/pictureService');

//Lay tat ca picture
const get_all_picture = async () => {
    try {
        const pictures = await picture_service.get_all_picture();
        return pictures;
    } catch (error) {
        console.log('Error get all picture: ' + error.message);
    }
};

//Lay picture theo id
const get_picture = async (_idPic) => {
    try {
        const picture = await picture_service.get_picture(_idPic);
        return picture;
    } catch (error) {
        console.log('Error get picture: ' + error.message);
    }
};

//Lay pictures theo idProduct
const get_pictures_by_idProduct = async (idSubProduct) => {
    try {
        const pictures = await picture_service.get_pictures_by_idProduct(idSubProduct);
        return pictures;
    } catch (error) {
        console.log('Error get pictures by idProduct: ' + error.message);
    }
}

//Lay pictures theo idReview
const get_pictures_by_idReview = async (idReview) => {
    try {
        const pictures = await picture_service.get_pictures_by_idReview(idReview);
        return pictures;
    } catch (error) {
        console.log('Error get pictures by idReview: ' + error.message);
    }
};

// Them picture
const add_picture = async (url, idSubProduct, idReview, idMessage) => {
    try {
        const picture = await picture_service.add_picture(url, idSubProduct, idReview, idMessage);
        return picture;
    } catch (error) {
        console.log('Error add picture: ' + error.message);
    }
};

module.exports = {
    add_picture, get_picture, get_pictures_by_idProduct, get_pictures_by_idReview, get_all_picture
}