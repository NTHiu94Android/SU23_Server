const brand_model = require('../brand/brandModel');

// lay tat ca brand 
const get_all_brand = async ()=>{
    const brands = await brand_model.find({});
    return brands;
};
// lay danh sach theo id
const get_brand_by_id = async (id)=>{
    const brand = await brand_model.findOne({_id :id});
     return brand;
};
//Lay brand theo idCategory
const get_brand_by_id_category = async (id) => {
    const brands = await brand_model.find({ idCategory: id });
    return brands;
};


module.exports = {
    get_brand_by_id_category , get_all_brand, get_brand_by_id
}

