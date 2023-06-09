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


// Lay danh sach brand 
const get_all_brand = async () => {
    try {
        const brands = brand_service.get_all_brand();
        return brands;
    } catch (error) {
        console.log('Error get all brand: ' + error.message);
    }
};


// lay brand theo id 
const get_brand_by_id = async (_id) => {
    try {
        const brand = await brand_service.get_brand_by_id(_id);
        return brand;
    } catch (error) {
        console.log('Error get brand: ' + error.message);
    }
};

module.exports = {
    get_brand_by_id_category, get_all_brand, get_brand_by_id
};