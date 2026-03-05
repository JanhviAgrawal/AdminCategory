const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    subCategory_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true
    },
    extraCategory_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExtraCategory",
        required: true
    },
    productPrice: {
        type: String,
        required: true
    },
    productOldPrice: {
        type: String,
        required: true
    },
    productStock: {
        type: String,
        required: true
    },
    productDescription: {
        type: String,
        required: true
    },
    productImage: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Products', productSchema, 'Products');