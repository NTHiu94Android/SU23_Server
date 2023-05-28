const brand_model = require('../brand/brandModel');

//Lay brand theo idCategory
const get_brand_by_id_category = async (id) => {
    const brands = await brand_model.find({ idCategory: id });
    return brands;
};

// add brand
const add_brand = async (name, image, idCategory) => {
    const brand = new brand_model({ name, image, idCategory });
    await brand.save();
    return brand;
};

module.exports = {
    get_brand_by_id_category, add_brand 
}

