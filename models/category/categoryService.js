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

//delete category by id
const delete_category = async (_id)=>{
    await category_model.findByIdAndDelete({_id:_id});
}

module.exports = { get_all_category, get_category_by_id, update_category, delete_category };
