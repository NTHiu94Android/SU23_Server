const reviewModel = require('./reviewModel');

//Them review
const add_review = async (time, content, rating, idUser, idProduct) => {
    const review = new reviewModel({
        time: time,
        content: content,
        rating: rating,
        idUser: idUser,
        idProduct: idProduct
    });
    const result = await review.save();
    return result;
};

//Lat tat ca review
const get_all_review = async () => {
    const result = await reviewModel.find();
    return result;
};

//Lay review theo idProduct
const get_review_by_idProduct = async (idProduct) => {
    const result = await reviewModel.find({ idProduct: idProduct });
    return result;
};

module.exports = {
    add_review, get_review_by_idProduct, get_all_review
};