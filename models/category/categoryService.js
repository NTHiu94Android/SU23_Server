const category_model = require('../category/categoryModel');

//Lay tat ca category
const get_all_category = async () => {
    const categories = await category_model.find({});
    return categories;
};

// lays category by id 
const get_category_by_id = async (_id) => {
    const category = await category_model.findOne({_id : _id});
    return category ;
};

//update category by id
const update_category = async (_id , name , image)=>{
    const category = await category_model.findByIdAndUpdate({_id:_id}, {name:name, image:image});
    return category;
};

module.exports = { get_all_category, get_category_by_id };
