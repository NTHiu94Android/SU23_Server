const sub_product_model = require('./subProductModel');


//Lay tat ca sub san pham
const getSubProducts = async () => {
    const subProduct = await sub_product_model.find();
    return subProduct;
};


//Lay subProducts theo idProduct
const getSubProductsByIdProduct = async (_idProduct) => {
    const subProduct = await sub_product_model.find({ idProduct: _idProduct });
    return subProduct;
};

//Cap nhat subProduct
const updateSubProduct = async (
    _id, price, description, quantity, color, sale,
    ram, rom, screen, cpu, pin, front_camera, back_camera, idProduct
) => {
    const subProduct = await sub_product_model.findByIdAndUpdate(_id, {
        price, description, quantity, color, sale, 
        ram, rom, screen, cpu, pin, front_camera, back_camera, idProduct
    });
    return subProduct;
};

//Add subProduct
const addSubProduct = async (
    price, description, quantity, color, sale,
    ram, rom, screen, cpu, pin, front_camera, back_camera, idProduct
) => {
    const subProduct = new sub_product_model({
        price, description, quantity, color, sale,
        ram, rom, screen, cpu, pin, front_camera, back_camera, idProduct
    });
    await subProduct.save();
    return subProduct;
};

//Xoa subProduct theo id
const deleteSubProduct = async (_id) => {
    const subProduct = await sub_product_model.findByIdAndDelete(_id);
    //Neu xoa thanh cong thi tra ve true
    if (subProduct) {
        return true;
    }
    return false;
}

module.exports = {
    getSubProducts, getSubProductsByIdProduct, addSubProduct, updateSubProduct, deleteSubProduct
};