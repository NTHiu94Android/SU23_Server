const addressService = require('./addressService');

//Lay address theo idUser
const get_address_by_idUser = async (idUser) => {
    try {
        const listddress = await addressService.get_address_by_idUser(idUser);
        return listddress;
    } catch (error) {
        console.log('Error get address by idUser: ' + error.message);
    }
};

//Them address
const add_address = async (body, status, numberPhone, idUser) => {
    try {
        const address = await addressService.add_address(body, status, numberPhone, idUser);
        return address;
    } catch (error) {
        console.log('Error add address: ' + error.message);
    }
};

//Cap nhat address
const update_address = async (_id, body, status, numberPhone, idUser) => {
    try {
        const address_update = await addressService
            .update_address(_id, body, status, numberPhone, idUser);
        return address_update;
    } catch (error) {
        console.log('Error update address: ' + error.message);
    }
};

//Xoa address
const delete_address = async (_id) => {
    try {
        const address_delete = await addressService.delete_address(_id);
        return address_delete;
    } catch (error) {
        console.log('Error delete address: ' + error.message);
    }
};

module.exports = {
    get_address_by_idUser, add_address, update_address, delete_address,
};