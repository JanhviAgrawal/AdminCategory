const SubCategory = require('../model/subCategory.model');
const Category = require('../model/category.model');
const ExtraCategory = require('../model/extraCategory.model');
const Product = require('../model/product.model');
const fs = require('fs');
const path = require('path');

// View All Subcategories
module.exports.viewSubCategory = async (req, res) => {
    try {
        const allSubCategories = await SubCategory.find().populate('category_id');
        return res.render("subCategory/viewSubCategory", {
            allSubCategory: allSubCategories
        });
    } catch (err) {
        console.log(err);
        return res.redirect('/dashboard');
    }
};

// Add Sub Category Page
module.exports.addSubCategorypage = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.render("subCategory/addSubCategory", {
            allCategory: categories
        });
    } catch (err) {
        return res.redirect('/dashboard');
    }
};

// Add Sub Category
module.exports.addSubCategory = async (req, res) => {
    try {
        if (req.file) {
            req.body.subCategoryImage = req.file.path;
        }
        await SubCategory.create(req.body);
        req.flash("success", "Sub-Category Created!");
        return res.redirect('/subCategory/viewSubCategory');
    } catch (error) {
        req.flash("error", "Failed to add sub-category");
        return res.redirect('back');
    }
};

// Edit Sub Category Page
module.exports.editSubCategoryPage = async (req, res) => {
    try {
        const singleSub = await SubCategory.findById(req.params.subCategoryId);
        const categories = await Category.find();
        return res.render("subCategory/editSubCategory", {
            singleSubCategory: singleSub,
            allCategory: categories
        });
    } catch (err) {
        return res.redirect('back');
    }
};

// Update Sub Category
module.exports.updateSubCategory = async (req, res) => {
    try {
        let sub = await SubCategory.findById(req.params.subCategoryId);
        if (req.file) {
            if (fs.existsSync(sub.subCategoryImage)) {
                fs.unlinkSync(sub.subCategoryImage);
            }
            req.body.subCategoryImage = req.file.path;
        }
        await SubCategory.findByIdAndUpdate(req.params.subCategoryId, req.body);
        req.flash("success", "Updated Successfully");
        return res.redirect('/subCategory/viewSubCategory');
    } catch (err) {
        return res.redirect('back');
    }
};

// Delete
module.exports.deleteSubCategory = async (req, res) => {
    try {
        const { subCategoryId } = req.params;
        
        const relatedProducts = await Product.find({ subCategory_id: subCategoryId });
        for (let product of relatedProducts) {
            if (product.productImage && fs.existsSync(product.productImage)) {
                fs.unlinkSync(product.productImage);
            }
            await Product.findByIdAndDelete(product._id);
        }

        const relatedExtraCategories = await ExtraCategory.find({ subCategory_id: subCategoryId });

        for (let extra of relatedExtraCategories) {
            if (extra.extraCategoryImage && fs.existsSync(extra.extraCategoryImage)) {
                fs.unlinkSync(extra.extraCategoryImage);
            }
            await ExtraCategory.findByIdAndDelete(extra._id);
        }

        const subToDelete = await SubCategory.findById(subCategoryId);

        if (!subToDelete) {
            req.flash("error", "Sub-Category Not Found");
            return res.redirect("/subCategory/viewSubCategory");
        }

        if (subToDelete.subCategoryImage && fs.existsSync(subToDelete.subCategoryImage)) {
            fs.unlinkSync(subToDelete.subCategoryImage);
        }

        await SubCategory.findByIdAndDelete(subCategoryId);

        req.flash("success", `${subToDelete.subCategoryName} and related Extra Categories deleted successfully`);
        return res.redirect('/subCategory/viewSubCategory');

    } catch (err) {
        console.log("Error in deleteSubCategory:", err);
        req.flash("error", "Something went wrong during deletion");
        return res.redirect('/subCategory/viewSubCategory');
    }
};