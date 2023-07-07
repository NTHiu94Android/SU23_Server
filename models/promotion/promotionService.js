const promotion_model = require('./promotionModel');

//Lay tat ca promotion theo idUser
const getAllPromotionByIdUser = async (idUser) => {
    const promotions = await promotion_model.find({ idUser: idUser });
    return promotions;
};

//Them moi promotion
const addPromotion = async (content, sale, maxSale, code, dayStart, dayEnd, condition, idUser) => {
    const promotion = new promotion_model({
        content, sale, maxSale, code, dayStart, dayEnd, condition, idUser
    });
    await promotion.save();
    return promotion;
};

//Cap nhat promotion khi submit
const updatePromotionSubmit = async (_id, isSubmit) => {
    const promotion = await promotion_model.findById(_id);
    promotion.isSubmit = isSubmit;
    await promotion.save();
};

//Xoa promotion
const deletePromotion = async (_id) => {
    const promotion = await promotion_model.findByIdAndDelete(_id);
    return promotion;
};

module.exports = {
    getAllPromotionByIdUser, addPromotion, deletePromotion, updatePromotionSubmit
}