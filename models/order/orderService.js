const order_model = require('../order/orderModel');

//Lay tat ca don hang
const get_all_order = async () => {
    const orders = await order_model.find({});
    return orders;
};

//Lay order theo idUser
const get_order_by_idUser = async (_idUser) => {
    const orders = await order_model.find({ idUser: _idUser });
    return orders;
};

// add order
const add_order = async (
    dateCreate, datePayment, totalPrice, status, paymentMethod, address, idUser
) => {
    const order = new order_model(
        { dateCreate, datePayment, totalPrice, status, paymentMethod, address, idUser }
    );
    await order.save();
    return order;
};

//cap nhat order
const update_order = async (
    _id, datePayment, status
) => {
    const order_update = await order_model.findByIdAndUpdate(
        { _id: _id },
        { datePayment: datePayment, status: status }
    );
    return order_update;
};

module.exports = {
    add_order, get_order_by_idUser, update_order, get_all_order
};