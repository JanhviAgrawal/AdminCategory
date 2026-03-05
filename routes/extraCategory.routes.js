const express = require('express');
const extraCategory = express.Router();
const upload = require('../milddleware/multer.middleware');
const { addExtraCategorypage, addExtraCategory, viewExtraCategory, deleteExtraCategory, getSubCategories, editExtraCategoryPage, updateExtraCategory } = require('../controller/extraCategory.controller');

extraCategory.get('/addExtraCategoryPage', addExtraCategorypage);
extraCategory.post('/addExtraCategory', upload.single('extraCategoryImage'), addExtraCategory);

extraCategory.get('/viewExtraCategory', viewExtraCategory);
extraCategory.get('/editExtraCategoryPage/:id', editExtraCategoryPage);
extraCategory.post('/updateExtraCategory/:id', upload.single('extraCategoryImage'), updateExtraCategory);
extraCategory.get('/deleteExtraCategory/:id', deleteExtraCategory);

extraCategory.get('/getSubCategories/:catId', getSubCategories);

module.exports = extraCategory;