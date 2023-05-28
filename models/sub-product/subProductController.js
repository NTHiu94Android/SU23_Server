const sub_product_service = require('./subProductService');


//Lay tat ca sub san pham
const onGetSubProducts = async () => {
    try {
        const subProducts = await sub_product_service.getSubProducts();
        return subProducts;
    } catch (error) {
        console.log('Error get sub products: ' + error.message);
    }
};

//Lay subProducts theo idProduct
const onGetSubProductsByIdProduct = async (idProduct) => {
    try {
        const subProducts = await sub_product_service.getSubProductsByIdProduct(idProduct);
        return subProducts;
    } catch (error) {
        console.log('Error get sub products: ' + error.message);
    }
};

//Cap nhat subProduct
const onUpdateSubProduct = async (
    _id, price, description, quantity, color, sale,
    ram, rom, screen, cpu, pin, front_camera, back_camera, idProduct
) => {
    try {
        const subProduct = await sub_product_service.updateSubProduct(
            _id, price, description, quantity, color, sale,
            ram, rom, screen, cpu, pin, front_camera, back_camera, idProduct
        );
        return subProduct;
    } catch (error) {
        console.log('Error update sub product: ' + error.message);
    }
};

//Add subProduct
const onAddSubProduct = async (
    price, description, quantity, color, sale,
    ram, rom, screen, cpu, pin, front_camera, back_camera, idProduct
) => {
    try {
        const subProduct = await sub_product_service.addSubProduct(
            price, description, quantity, color, sale,
            ram, rom, screen, cpu, pin, front_camera, back_camera, idProduct
        );
        return subProduct;
    } catch (error) {
        console.log('Error add sub product: ' + error.message);
    }
};

module.exports = {
    onGetSubProducts, onGetSubProductsByIdProduct, onAddSubProduct, onUpdateSubProduct
};