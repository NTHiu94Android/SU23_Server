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

module.exports = {
    getSubProducts, getSubProductsByIdProduct, addSubProduct, updateSubProduct
};