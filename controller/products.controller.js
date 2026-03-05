const Category = require('../model/category.model');
const SubCategory = require('../model/subCategory.model');
const ExtraCategory = require('../model/extraCategory.model');
const Products = require('../model/product.model');
const fs = require('fs');

// 1. View Products
module.exports.viewProducts = async (req, res) => {
    try {
        const allProducts = await Products.find()
            .populate('category_id')
            .populate('subCategory_id')
            .populate('extraCategory_id');
        return res.render("products/viewProducts", { allProducts });
    } catch (err) {
        console.log(err);
        return res.redirect('/dashboard');
    }
};

// 2. Add Product Page
module.exports.addProductsPage = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.render("products/addProducts", { allCategory: categories });
    } catch (err) {
        return res.redirect('/products/viewProducts');
    }
};

// 3. AJAX: Get Extra Categories (Used for dynamic dropdowns)
module.exports.getExtraCategories = async (req, res) => {
    try {
        const extraData = await ExtraCategory.find({ subCategory_id: req.params.subId });
        return res.json(extraData);
    } catch (err) {
        return res.status(500).json({ error: "Server Error" });
    }
};

// 4. Add Product Logic
module.exports.addProducts = async (req, res) => {
    try {
        if (req.file) {
            req.body.productImage = req.file.path;
        }
        await Products.create(req.body);
        req.flash("success", "Product added successfully");
        return res.redirect('/products/viewProducts');
    } catch (error) {
        console.log(error);
        req.flash("error", "Failed to add product");
        return res.redirect('/products/viewProducts');
    }
};

// 5. Edit Product Page (FIXED: Added this function)
module.exports.editProductsPage = async (req, res) => {
    try {
        const { id } = req.params;
        const singleProduct = await Products.findById(id);

        if (!singleProduct) {
            req.flash("error", "Product not found");
            return res.redirect('/products/viewProducts');
        }

        // Fetch dropdown data to populate existing selections
        const categories = await Category.find();
        const subCategories = await SubCategory.find({ category_id: singleProduct.category_id });
        const extraCategories = await ExtraCategory.find({ subCategory_id: singleProduct.subCategory_id });

        return res.render('products/editProducts', {
            singleProduct,
            allCategory: categories,
            allSubCategory: subCategories,
            allExtraCategory: extraCategories
        });
    } catch (err) {
        console.log("Error in editProductsPage:", err);
        return res.redirect('/products/viewProducts');
    }
};

module.exports.updateProducts = async (req, res) => {
    try {
        const { id } = req.params; 
        
        const oldProduct = await Products.findById(id);
        if (!oldProduct) {
            req.flash("error", "Product not found");
            console.log("Product Not Found");
            return res.redirect('/products/viewProducts');
        }

        if (req.file) {
            req.body.productImage = req.file.path;
            if (oldProduct.productImage && fs.existsSync(oldProduct.productImage)) {
                fs.unlinkSync(oldProduct.productImage);
            }
        }

        const updated = await Products.findByIdAndUpdate(id, req.body);
        
        if(updated) {
            req.flash("success", "Product updated successfully");
        }
        
        return res.redirect('/products/viewProducts');
    } catch (err) {
        req.flash("error", "Failed to update product");
        console.log("Update Error:", err);
        return res.redirect('/products/viewProducts');
    }
};

// 7. Delete Product
module.exports.deleteProducts = async (req, res) => {
    try {
        const data = await Products.findById(req.params.id);
        if (!data) {
            req.flash("error", "Product not found");
            return res.redirect('/products/viewProducts');
        }
        if (data.productImage && fs.existsSync(data.productImage)) {
            fs.unlinkSync(data.productImage);
        }
        await Products.findByIdAndDelete(req.params.id);
        req.flash("success", "Product deleted successfully");
        return res.redirect('/products/viewProducts');
    } catch (err) {
        req.flash("error", "Failed to delete product");
        return res.redirect('/products/viewProducts');
    }
};