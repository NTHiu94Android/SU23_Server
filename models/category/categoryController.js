const category_service = require('./categoryService');

//Lay tat ca category
const get_all_category = async () => {
    try {
        const categories = await category_service.get_all_category();
        return categories;
    } catch (error) {
        console.log('Error get all category: ' + error.message);
    }
};


// lay category theo id 
const get_category_by_id = async (_id) =>{
    try {
        const category = await category_service.get_category_by_id(_id);
        return category;
    } catch (error) {
        console.log('Error get category: ' + error.message);
    }
};

module.exports = { get_all_category, get_category_by_id };