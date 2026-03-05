const mongoose = require('mongoose');

const extraCategorySchema = mongoose.Schema({
    extraCategoryName: {
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
    extraCategoryImage: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('ExtraCategory', extraCategorySchema, 'ExtraCategory');