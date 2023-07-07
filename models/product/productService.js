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

//Cap nhat san pham
const update_product = async (_id, name, image, idCategory, idBrand) => {
    const product = await product_model.findById(_id);
    product.name = name;
    product.image = image;
    product.idCategory = idCategory;
    product.idBrand = idBrand;
    await product.save();
    return product;
};

//Cap nhat ngay cua san pham
const update_date_product = async (_id) => {
    const product = await product_model.findById(_id);
    product.dateInput = Date.now();
    await product.save();
    return product;
};

//Xoa san pham
const delete_product = async (_id) => {
    const product = await product_model.findById(_id);
    await product.remove();
    //Xoa tat ca sub product cua san pham
    await sub_product_model.deleteMany({ idProduct: _id });
    return product;
};

module.exports = { 
    add_product, getProducts, update_product, delete_product, update_date_product
};