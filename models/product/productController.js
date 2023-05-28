const product_service = require('../product/productService');

//Lay tat ca product
const onGetProducts = async () => {
    try {
        const products = await product_service.getProducts();
        return products;
    } catch (error) {
        console.log('Error get products: ' + error.message);
    }
};

//Add product
const onAddroduct = async (name, image, idCategory, idBrand) => {
    try {
        const product = await product_service.add_product(name, image, idCategory, idBrand);
        return product;
    } catch (error) {
        console.log('Error add product: ' + error.message);
    }
};

module.exports = {
    onAddroduct, onGetProducts,
};