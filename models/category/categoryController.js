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

//update category by id
const update_category = async (_id , name , image)=>{
    try {
        const category = await category_service.update_category(_id , name , image);
        return category;
    } catch (error) {
        console.log('Error update category: ' + error.message);
    }
}

//delete category by id
const delete_category = async (_id)=>{
    try {
        await category_service.delete_category(_id);
    } catch (error) {
        console.log('Error delete category: ' + error.message);
    }
}

module.exports = { get_all_category, get_category_by_id, update_category, delete_category };