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

//Lay san pham theo id
const onGetProductById = async (_id) => {
    try {
        const products = await product_service.getProducts();
        if(!products) return null;
        for (let i = 0; i < products.length; i++) {
            if(products[i]._id == _id){
                return products[i];
            }
        }
    } catch (error) {
        console.log('Error get products: ' + error.message);
    }
}

//Lay san pham theo idbrand
const onGetProductByIdBrand = async (_idBrand) => {
    try {
        const products = await onGetProducts();
        if(!products) return null;
        let result = [];
        for (let i = 0; i < products.length; i++) {
            if(products[i].idBrand == _idBrand){
                result.push(products[i]);
            }
        }
        return result;
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

//Cap nhat san pham
const onUpdateProduct = async (_id, name, image, idCategory, idBrand) => {
    try {
        const product = await product_service.update_product(_id, name, image, idCategory, idBrand);
        return product;
    } catch (error) {
        console.log('Error update product: ' + error.message);
    }
};

//Cap nhat ngay cua san pham
const onUpdateDateProduct = async (_id) => {
    try {
        const product = await product_service.update_date_product(_id);
        return product;
    } catch (error) {
        console.log('Error update date product: ' + error.message);
    }
};

//Xoa san pham
const onDeleteProduct = async (_id) => {
    try {
        const product = await product_service.delete_product(_id);
        return product;
    } catch (error) {
        console.log('Error delete product: ' + error.message);
    }
};

module.exports = {
    onAddroduct, onGetProducts, onUpdateProduct, onDeleteProduct, onGetProductById, onGetProductByIdBrand, onUpdateDateProduct
};