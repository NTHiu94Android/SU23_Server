const category_service = require('./categoryService');

//Lay category theo id
const get_category_by_id = async (_id) => {
    try{
        const category = await category_service.get_category_by_id(_id);
        return category;
    }catch(error){
        console.log('Error get category: ' + error.message);
    }
};

//Lay tat ca category
const get_all_category = async () => {
    try{
        const categories = await category_service.get_all_category();
        return categories;
    }catch(error){
        console.log('Error get all category: ' + error.message);
    }
};

//Cap nhat category theo id
const update_category = async (_id, name, image) => {
    try{
        const category = await category_service.update_category(_id, name, image);
        return category;
    }catch(error){
        console.log('Error update category: ' + error.message);
    }
};

//Xoa category theo id
const delete_category = async (_id) => {
    try {
        const res = await category_service.delete_category(_id);
        //Neu xoa thanh cong thi tra ve true
        return res;
    } catch (error) {
        console.log('Error delete category: ' + error.message);
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

module.exports = { get_all_category, add_category, update_category, delete_category, get_category_by_id };