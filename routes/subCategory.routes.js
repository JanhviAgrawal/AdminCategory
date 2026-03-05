const express = require('express');
const subCategoryRoute = express.Router();
const upload = require('../milddleware/multer.middleware');
const { addSubCategorypage, addSubCategory, viewSubCategory, editSubCategoryPage, updateSubCategory, deleteSubCategory } = require('../controller/subCategory.controller');

subCategoryRoute.get('/addSubCategoryPage', addSubCategorypage);
subCategoryRoute.post('/addSubCategory', upload.single('subCategoryImage'), addSubCategory);

subCategoryRoute.get('/viewSubCategory', viewSubCategory);

subCategoryRoute.get('/editSubCategory/:subCategoryId', editSubCategoryPage);
subCategoryRoute.post('/updateSubCategory/:subCategoryId', upload.single('subCategoryImage'), updateSubCategory);

subCategoryRoute.get('/deleteSubCategory/:subCategoryId', deleteSubCategory);

module.exports = subCategoryRoute;