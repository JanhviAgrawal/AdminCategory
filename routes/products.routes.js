const express = require('express');
const productRoute = express.Router();
const upload = require('../milddleware/multer.middleware');
const { addProductsPage, addProducts, viewProducts, getExtraCategories, deleteProducts, editProductsPage, updateProducts } = require('../controller/products.controller');

productRoute.get('/addProductsPage', addProductsPage);
productRoute.post('/addProducts', upload.single('productImage'), addProducts);
productRoute.get('/viewProducts', viewProducts);

productRoute.get('/editProducts/:id', editProductsPage);
productRoute.post('/updateProducts/:id', upload.single('productImage'), updateProducts);

productRoute.get('/getExtraCategories/:subId', getExtraCategories);
productRoute.get('/deleteProducts/:id', deleteProducts);

module.exports = productRoute;