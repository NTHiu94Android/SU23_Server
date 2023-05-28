const reviewService = require('./reviewService');

//Them review
const add_review = async (time, content, rating, idUser, idProduct) => {
    try {
        const review = await reviewService.add_review(
            time, content, rating, idUser, idProduct
        );
        return review;
    } catch (error) {
        console.log("Error add review: " + error.message);
    }
};

//Lat tat ca review
const get_all_review = async () => {
    try {
        const review = await reviewService.get_all_review();
        return review;
    } catch (error) {
        console.log("Error get all review: " + error.message);
    }
};

//Lay review theo idProduct
const get_review_by_idProduct = async (idProduct) => {
    try {
        const review = await reviewService.get_review_by_idProduct(idProduct);
        return review;
    } catch (error) {
        console.log("Error get review by idProduct: " + error.message);
    }
};

module.exports = {
    add_review, get_review_by_idProduct, get_all_review
};