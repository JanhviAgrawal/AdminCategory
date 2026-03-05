const Category = require('../model/category.model');
const SubCategory = require('../model/subCategory.model');
const ExtraCategory = require('../model/extraCategory.model');
const Product = require('../model/product.model');
const fs = require('fs');

module.exports.getSubCategories = async (req, res) => {
    try {
        const subData = await SubCategory.find({ category_id: req.params.catId });
        return res.json(subData);
    } catch (err) {
        return res.status(500).json({ error: "Server Error" });
    }
};

module.exports.addExtraCategorypage = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.render("extraCategory/addExtraCategory", { allCategory: categories });
    } catch (err) {
        return res.redirect('back');
    }
};

module.exports.addExtraCategory = async (req, res) => {
    try {
        if (req.file) req.body.extraCategoryImage = req.file.path;
        await ExtraCategory.create(req.body);
        req.flash("success", "Extra category added successfully");
        return res.redirect('/extraCategory/viewExtraCategory');
    } catch (error) {
        req.flash("error", "Failed to add extra category");
        return res.redirect('back');
    }
};

module.exports.viewExtraCategory = async (req, res) => {
    try {
        const data = await ExtraCategory.find()
            .populate('category_id')
            .populate('subCategory_id');
        return res.render("extraCategory/viewExtraCategory", { allExtraCategory: data });
    } catch (err) {
        return res.redirect('/dashboard');
    }
};

module.exports.editExtraCategoryPage = async (req, res) => {
    try {
        const extraCat = await ExtraCategory.findById(req.params.id).populate('category_id').populate('subCategory_id');
        const categories = await Category.find();
        const subCategories = await SubCategory.find({ category_id: extraCat.category_id._id });
        return res.render("extraCategory/editExtraCategory", {
            singleExtraCategory: extraCat,
            allCategory: categories,
            allSubCategory: subCategories
        });
    } catch (err) {
        console.log(err);
        return res.redirect('back');
    }
};

module.exports.updateExtraCategory = async (req, res) => {
    try {
        let extraCat = await ExtraCategory.findById(req.params.id);
        if (req.file) {
            if (fs.existsSync(extraCat.extraCategoryImage)) {
                fs.unlinkSync(extraCat.extraCategoryImage);
            }
            req.body.extraCategoryImage = req.file.path;
        }
        await ExtraCategory.findByIdAndUpdate(req.params.id, req.body);
        req.flash("success", "Extra category updated successfully");
        return res.redirect('/extraCategory/viewExtraCategory');
    } catch (err) {
        req.flash("error", "Failed to update extra category");
        return res.redirect('back');
    }
};

module.exports.deleteExtraCategory = async (req, res) => {
    try {
        // Delete related products first
        const relatedProducts = await Product.find({ extraCategory_id: req.params.id });
        for (let product of relatedProducts) {
            if (product.productImage && fs.existsSync(product.productImage)) {
                fs.unlinkSync(product.productImage);
            }
            await Product.findByIdAndDelete(product._id);
        }

        const data = await ExtraCategory.findById(req.params.id);
        if (fs.existsSync(data.extraCategoryImage)) fs.unlinkSync(data.extraCategoryImage);
        await ExtraCategory.findByIdAndDelete(req.params.id);
        req.flash("success", "Extra category deleted successfully");
        return res.redirect('/extraCategory/viewExtraCategory');
    } catch (err) {
        req.flash("error", "Failed to delete extra category");
        return res.redirect('/extraCategory/viewExtraCategory');
    }
};