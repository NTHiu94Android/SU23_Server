const order_detail_service = require('./orderDetailService');

//Lay order_detail theo idOrder
const get_order_detail_by_idOrder = async (_idOrder) => {
    try {
        const order_details = await order_detail_service
            .get_order_detail_by_idOrder(_idOrder);
        return order_details;
    } catch (error) {
        console.log('Error get order detail by idOrder: ' + error.message);
    }
};

//Lay tat ca order_detail
const get_all_order_detail = async () => {
    try {
        const order_details = await order_detail_service.get_all_order_detail();
        return order_details;
    } catch (error) {
        console.log('Error get all order detail: ' + error.message);
    }
};


//Add order_detail
const add_order_detail = async (quantity, price, idOrder, idSubProduct) => {
    try {
        const order_detail = await order_detail_service
            .add_order_detail(quantity, price, idOrder, idSubProduct);
        return order_detail;
    } catch (error) {
        console.log('Error add order detail: ' + error.message);
    }
};

//Delete order_detail
const delete_order_detail = async (_id) => {
    try {
        const response = await order_detail_service.delete_order_detail(_id);
        return response;
    } catch (error) {
        console.log('Error delete order detail: ' + error.message);
    }
};

//Update order_detail
const update_order_detail = async (_id, quantity, price, isCmt, idOrder, idSubProduct) => {
    try {
        const order_detail_update = await order_detail_service
            .update_order_detail(_id, quantity, price, isCmt, idOrder, idSubProduct);
        return order_detail_update;
    } catch (error) {
        console.log('Error update order detail: ' + error.message);
    }
};

module.exports = {
    add_order_detail, get_order_detail_by_idOrder,
    delete_order_detail, update_order_detail, get_all_order_detail,
};