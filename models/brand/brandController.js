const brand_service = require('../brand/brandService');

//Lay tat ca brand
const get_all_brand = async () => {
    try {
        const brands = await brand_service.get_all_brand();
        return brands;
    } catch (error) {
        console.log('Error get all brand: ' + error.message);
    }
};

//Lay brand theo id
const get_brand_by_id = async (_id) => {
    try {
        const brand = await brand_service.get_brand_by_id(_id);
        return brand;
    } catch (error) {
        console.log('Error get brand: ' + error.message);
    }
};

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

// update brand
const update_brand = async (id, name, image, idCategory) => {
    try {
        const brand = await brand_service.update_brand(id, name, image, idCategory);
        return brand;
    } catch (error) {
        console.log('Error update brand: ' + error.message);
    }
};

// delete brand
const delete_brand = async (id) => {
    try {
        await brand_service.delete_brand(id);
    } catch (error) {
        console.log('Error delete brand: ' + error.message);
    }
};


module.exports = {
    add_brand, get_brand_by_id_category, get_all_brand, update_brand, delete_brand, get_brand_by_id
};