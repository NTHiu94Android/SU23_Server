const mongoose = require('mongoose');

mongoose.set("strictQuery", false);
async function connect() {
    mongoose.connect('mongodb+srv://ngochuongtr1975:Amcc0123@cluster0.fslarjw.mongodb.net/iTech?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }) 
        .then(() => console.log('>>>>>>>>>> DB Connected!!!!!!'))
        .catch(err => console.log('>>>>>>>>> DB Error: ', err));
}  
 
module.exports = { connect };