const Category = require('../model/category.model'); 
const SubCategory = require('../model/subCategory.model'); 
const ExtraCategory = require('../model/extraCategory.model'); 
const Product = require('../model/product.model');
const fs = require('fs');

// Add Category Page
module.exports.addCategorypage = (req, res) => {
    try {
        return res.render("category/addCategory");
    } catch (err) {
        console.log("Something went Wrong..", err);
        return res.redirect('/dashboard');
    }
};

// Add Category
module.exports.addCategory = async (req, res) => {
    try {
        if (req.file) {
            req.body.categoryImage = req.file.path;
        }

        const newCategory = await Category.create(req.body);

        if (newCategory) {
            req.flash("success", "Category added successfully");
        } else {
            req.flash("error", "Failed to add category");
        }

        return res.redirect('/category/viewCategory');

    } catch (error) {
        req.flash("error", "Something went wrong");
        console.log("Error", error);
        return res.redirect('/category/addCategoryPage');
    }
};

// View Category
module.exports.viewCategory = async (req, res) => {
    try {
        const allCategory = await Category.find();
        return res.render('category/viewCategory', { allCategory });
    } catch (err) {
        console.log("Something went Wrong..", err);
        return res.redirect('/dashboard');
    }
};

// Edit Category Page
module.exports.editCategoryPage = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const singleCategory = await Category.findById(categoryId);

        if (!singleCategory) {
            return res.redirect('/category/viewCategory');
        }
        return res.render('category/editCategory', { singleCategory });

    } catch (err) {
        console.log("Error in editCategoryPage:", err);
        return res.redirect('/category/viewCategory');
    }
};

// Update Category
module.exports.updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const oldCategory = await Category.findById(categoryId);

        if (!oldCategory) {
            req.flash('error', "Category not found");
            return res.redirect('/category/viewCategory');
        }

        if (req.file) {
            req.body.categoryImage = req.file.path;
            if (oldCategory.categoryImage && fs.existsSync(oldCategory.categoryImage)) {
                fs.unlinkSync(oldCategory.categoryImage);
            }
        }

        await Category.findByIdAndUpdate(categoryId, req.body);
        req.flash('success', "Category updated successfully");
        return res.redirect('/category/viewCategory');

    } catch (err) {
        req.flash('error', "Failed to update category");
        console.log("Error in updateCategory:", err);
        return res.redirect('/category/viewCategory');
    }
};

// Delete Category
module.exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // 1. Delete Products first
    const products = await Product.find({ category_id: categoryId });
    for (let product of products) {
      if (product.productImage && fs.existsSync(product.productImage)) {
          fs.unlinkSync(product.productImage);
      }
      await Product.findByIdAndDelete(product._id);
    }

    // 2. Delete Extra Categories
    const extraCategories = await ExtraCategory.find({ category_id: categoryId });
    for (let extra of extraCategories) {
      if (extra.extraCategoryImage && fs.existsSync(extra.extraCategoryImage)) {
          fs.unlinkSync(extra.extraCategoryImage);
      }
      await ExtraCategory.findByIdAndDelete(extra._id);
    }

    // 3. Delete Sub Categories
    const subCategories = await SubCategory.find({ category_id: categoryId });
    for (let sub of subCategories) {
      if (sub.subCategoryImage && fs.existsSync(sub.subCategoryImage)) {
          fs.unlinkSync(sub.subCategoryImage);
      }
      await SubCategory.findByIdAndDelete(sub._id);
    }

    // 4. Delete the Main Category
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      req.flash("error", "Category Not Found");
      return res.redirect("/category/viewCategory"); 
    }

    // Category image delete
    if (deletedCategory.categoryImage && fs.existsSync(deletedCategory.categoryImage)) {
        fs.unlinkSync(deletedCategory.categoryImage);
    }

    req.flash("success", "Category and all related items deleted successfully");
    return res.redirect("/category/viewCategory"); 

  } catch (err) {
    console.log("Delete Error:", err);
    req.flash("error", "Delete Failed");
    return res.redirect("/category/viewCategory"); 
  }
};