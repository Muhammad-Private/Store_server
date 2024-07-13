const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductsSchema = new Schema({
//     id: {
//         type: String, 
//         unique:true
//    },
    ProductName: {
         type: String, 
    },
    Price:{
        type:String,
    },
    Image: { 
        type: String,  
    }
});

module.exports = mongoose.model("products", ProductsSchema);
