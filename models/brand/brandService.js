const brand_model = require('../brand/brandModel');

//Lay tat ca brand
const get_all_brand = async () => {
    const brands = await brand_model.find({});
    return brands;
};

//Lay brand theo id
const get_brand_by_id = async (id) => {
    const brand = await brand_model.findOne({ _id: id });
    return brand;
};

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

// update brand
const update_brand = async (id, name, image, idCategory) => {
    const brand = await brand_model.findById(id);
    brand.name = name;
    brand.image = image;
    brand.idCategory = idCategory;
    await brand.save();
    return brand;
};

// delete brand
const delete_brand = async (id) => {
    await brand_model.findByIdAndDelete(id);
};

module.exports = {
    get_brand_by_id_category, add_brand , get_all_brand, update_brand, delete_brand, get_brand_by_id
}

