const express = require('express');
const upload = require('../milddleware/multer.middleware');
const { deleteCategory, updateCategory, editCategoryPage, viewCategory, addCategory, addCategorypage } = require('../controller/category.controller');

const categoryRoute = express.Router();

categoryRoute.get('/addCategoryPage', addCategorypage);
categoryRoute.post('/addCategory', upload.single('categoryImage'), addCategory);

categoryRoute.get('/viewCategory', viewCategory);

categoryRoute.get('/editCategory/:categoryId', editCategoryPage);
categoryRoute.post('/editCategory/:categoryId', upload.single('categoryImage'), updateCategory);

categoryRoute.get('/deleteCategory/:categoryId', deleteCategory);

module.exports = categoryRoute;