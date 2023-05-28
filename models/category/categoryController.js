const category_service = require('./categoryService');

//Lay tat ca category
const get_all_category = async () => {
    try{
        const categories = await category_service.get_all_category();
        return categories;
    }catch(error){
        console.log('Error get all category: ' + error.message);
    }
};

//Them category
const add_category = async (name, image) => {
    try {
        const category = await category_service.add_category(name, image);
        return category;
    } catch (error) {
        console.log('Error add category: ' + error.message);
    }
};

module.exports = { get_all_category, add_category };