const product_model = require('../product/productModel');

//Lay tat ca product
const getProducts = async () => {
    const products = await product_model.find();
    return products;
};

//Add product
const add_product = async (name, image, idCategory, idBrand) => {
    const product = new product_model({ name, image, idCategory, idBrand });
    await product.save();
    return product;
};

module.exports = { 
    add_product, getProducts
};