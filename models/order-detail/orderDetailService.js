const order_detail_model = require('./orderDetailModel');

//Lay order_detail theo idOrder
const get_order_detail_by_idOrder = async (_idOrder) => {
    const order_details = await order_detail_model.find({ idOrder: _idOrder });
    return order_details;
};

//Lay tat ca order_detail
const get_all_order_detail = async () => {
    const order_details = await order_detail_model.find({});
    return order_details;
};

//Add order_detail
const add_order_detail = async (quantity, price, idOrder, idSubProduct) => {
    const order_detail = new order_detail_model({ quantity, price, idOrder, idSubProduct });
    await order_detail.save();
    return order_detail;
};

//Delete order_detail
const delete_order_detail = async (_id) => {
    await order_detail_model.findByIdAndDelete(_id);
    return true;
};

//Update order_detail
const update_order_detail = async (_id, quantity, price, isCmt, idOrder, idSubProduct) => {
    const order_detail_update = order_detail_model.findByIdAndUpdate(_id,
        { quantity, price, isCmt, idOrder, idSubProduct }
    );
    return order_detail_update;
};

module.exports = {
    add_order_detail, get_order_detail_by_idOrder,
    delete_order_detail, update_order_detail, get_all_order_detail
};