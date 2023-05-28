const category_model = require('../category/categoryModel');

//Lay tat ca category
const get_all_category = async () => {
    const categories = await category_model.find({});
    return categories;
};

//Them category
const add_category = async (name, image) => {
    const category = new category_model({
        name: name,
        image: image
    });
    await category.save();
    return category;
};

module.exports = { get_all_category, add_category };
