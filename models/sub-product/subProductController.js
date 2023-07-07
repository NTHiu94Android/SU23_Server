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

//Lay subProduct theo id
const onGetSubProductById = async (_id) => {
    try {
        const subProducts = await sub_product_service.getSubProducts(_id);
        const subProduct = subProducts.find(subProduct => subProduct._id == _id);
        return subProduct;
    } catch (error) {
        console.log('Error get sub product by id: ' + error.message);
    }
}

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

//Cap nhat ngay cua subProduct
const onUpdateDateSubProduct = async (_id) => {
    try {
        const subProduct = await sub_product_service.updateDateSubProduct(_id);
        return subProduct;
    } catch (error) {
        console.log('Error update date sub product: ' + error.message);
    }
};

//Cap nhat so luong subProduct
const onUpdateQuantitySubProduct = async (_id, quantity) => {
    try {
        const subProduct = await sub_product_service.updateQuantitySubProduct(_id, quantity);
        return subProduct;
    } catch (error) {
        console.log('Error update quantity sub product: ' + error.message);
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

//Xoa subProduct
const onDeleteSubProduct = async (_id) => {
    try {
        const subProduct = await sub_product_service.deleteSubProduct(_id);
        return subProduct;
    } catch (error) {
        console.log('Error delete sub product: ' + error.message);
    }
}

module.exports = {
    onGetSubProducts, onGetSubProductsByIdProduct, onAddSubProduct, 
    onUpdateSubProduct, onGetSubProductById, onUpdateQuantitySubProduct, onUpdateDateSubProduct,
    onDeleteSubProduct
};