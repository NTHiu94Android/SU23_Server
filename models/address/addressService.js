const addressModel = require('./addressModel');

//Lay address theo idUser
const get_address_by_idUser = async (idUser) => {
    const ListAddress = await addressModel.find({ idUser: idUser });
    return ListAddress;
};

//Them address
const add_address = async (body, status, idUser) => {
    const address = new addressModel({
        body: body,
        status: status,
        idUser: idUser
    });
    const result = await address.save();
    return result;
};

//Cap nhat address
const update_address = async (_id, body, status, idUser) => {
    const result = await addressModel.findByIdAndUpdate({ _id: _id }, {
        body: body,
        status: status,
        idUser: idUser
    });
    return result;
};

//Xoa address
const delete_address = async (_id) => {
    const result = await addressModel.findByIdAndDelete({ _id: _id });
    return result;
};

module.exports = {
    get_address_by_idUser, add_address, update_address, delete_address,
};