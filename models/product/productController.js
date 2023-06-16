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

//Lay product theo idbrand
const onGetProductsByIdBrand = async (idBrand) => {
    try {
        const products = await onGetProducts();
        const productsByIdBrand = products.filter(product => product.idBrand == idBrand);
        return productsByIdBrand;
    } catch (error) {
        console.log('Error get products: ' + error.message);
    }
}

//Add product
const onAddroduct = async (name, image, idCategory, idBrand) => {
    try {
        const product = await product_service.add_product(name, image, idCategory, idBrand);
        return product;
    } catch (error) {
        console.log('Error add product: ' + error.message);
    }
};

//Xoa product theo id
const onDeleteProduct = async (_id) => {
    try {
        const res = await product_service.delete_product(_id);
        if (!res) {
            return false;
        }
        return true;
    } catch (error) {
        console.log('Error delete product: ' + error.message);
    }
}

module.exports = {
    onAddroduct, onGetProducts, onDeleteProduct, onGetProductsByIdBrand
};