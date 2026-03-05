const mongoose = require('mongoose');

const subCategorySchema = mongoose.Schema({
    subCategoryName: {
        type: String,
        required: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    subCategoryImage: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('SubCategory', subCategorySchema, 'SubCategory');