const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sub_product_model = new Schema({
    price: { type: Number },
    description: { type: String },
    quantity: { type: Number },
    color: { type: String },
    sale: { type: Number },

    ram: { type: Number },
    rom: { type: Number },
    screen: { type: String },
    cpu: { type: String },
    pin: { type: Number },
    
    frontCamera: { type: String },
    backCamera: { type: String },

    idProduct: { type: String },
});

module.exports = mongoose.model('SubProduct', sub_product_model);