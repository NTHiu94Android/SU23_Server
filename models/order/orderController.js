const order_service = require('../order/orderService');

//Lay tat ca don hang
const get_all_order = async () => {
    try {
        const orders = await order_service.get_all_order();
        return orders;
    } catch (error) {
        console.log('Error get all order: ' + error.message);
    }
};

//Lay order theo id
const get_order_by_id = async (_id) => {
    try {
        const orders = await order_service.get_all_order();
        const order = orders.find(order => order._id == _id);
        return order;
    } catch (error) {
        console.log('Error get order by id: ' + error.message);
    }
};


//Lay order theo idUser
const get_order_by_idUser = async (_idUser) => {
    try {
        const orders = await order_service.get_order_by_idUser(_idUser);
        return orders;
    } catch (error) {
        console.log('Error get order by idUser: ' + error.message);
    }
};

// add order
const add_order = async (dateCreate, datePayment, totalPrice, status, paymentMethod, address, idUser) => {
    try {
        const order = await order_service
            .add_order(dateCreate, datePayment, totalPrice, status, paymentMethod, address, idUser);
        return order;
    } catch (error) {
        console.log('Error add order: ' + error.message);
    }
};

//update order
const update_order = async ( _id, datePayment, status) => {
    try {
        const order_update = await order_service
            .update_order( _id, datePayment, status);
        return order_update;
    } catch (error) {
        console.log('Error update order: ' + error.message);
    }
};

module.exports = {
    add_order, get_order_by_idUser, update_order, get_all_order, get_order_by_id
};