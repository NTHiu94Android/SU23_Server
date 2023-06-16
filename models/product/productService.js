const product_model = require('../product/productModel');
const sub_product_model = require('../sub-product/subProductModel');

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

//Xoa san pham
const delete_product = async (_id) => {
    const product = await product_model.findById(_id);
    await product.remove();
    //Xoa tat ca sub product cua san pham
    const sub_products = await sub_product_model.find({ idProduct: _id });
    if(sub_products.length > 0) {
        await sub_product_model.deleteMany({ idProduct: _id });
    }
    return product;
};

module.exports = { 
    add_product, getProducts, delete_product
};