const brand_service = require('../brand/brandService');

//Lay brand theo idCategory
const get_brand_by_id_category = async (_idCategory) => {
    try {
        const brands = await brand_service.get_brand_by_id_category(_idCategory);
        return brands;
    } catch (error) {
        console.log('Error get brand: ' + error.message);
    }
};

// add brand
const add_brand = async (name, image, idCategory) => {
    try {
        const brand = await brand_service.add_brand(name, image, idCategory);
        return brand;
    } catch (error) {
        console.log('Error add brand: ' + error.message);
    }
};

module.exports = {
    add_brand, get_brand_by_id_category
};