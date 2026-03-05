const express = require('express');
const multer = require('multer');
const { 
    loginPage, checkLogin, logout, dashboardPage, profilePage, 
    changePasswordPage, changePassword, forgetPage, verifyEmail, 
    OTPpage, OTPVerify, newPasswordPage, changeNewPassword, 
    addAdminPage, viewAdminPage, insertAdmin, deleteAdmin, 
    editAdminPage, updateAdmin 
} = require('../controller/admin.controller');
const upload = require('../milddleware/multer.middleware');
const passport = require('passport');

const route = express.Router();

route.get('/', passport.checkAuthIsNotDone, loginPage);
route.post('/login', passport.checkAuthIsNotDone, passport.authenticate("localAuth", {
    failureRedirect: "/",
    failureFlash: true
}), checkLogin);

// Forget Password
route.get('/verify-email', passport.checkAuthIsNotDone, forgetPage);
route.post('/verify-email', passport.checkAuthIsNotDone, verifyEmail);
route.get('/otp-page', passport.checkAuthIsNotDone, passport.isOtpGenerated, OTPpage);
route.post('/otp-verify', passport.checkAuthIsNotDone, passport.isOtpGenerated, OTPVerify);
route.get('/newPasswordPage', passport.checkAuthIsNotDone, passport.isOtpVerified, newPasswordPage);
route.post('/change-new-password', passport.checkAuthIsNotDone, passport.isOtpVerified, changeNewPassword);


route.get('/dashboard', passport.checkAuthIsDone, dashboardPage);
route.get('/profile', passport.checkAuthIsDone, profilePage);
route.get('/logout', passport.checkAuthIsDone, logout);

// Password Management
route.get('/change-password', passport.checkAuthIsDone, changePasswordPage);
route.post('/change-password', passport.checkAuthIsDone, changePassword);

route.get('/addAdminPage', passport.checkAuthIsDone, addAdminPage);
route.get('/viewAdminPage', passport.checkAuthIsDone, viewAdminPage);

route.post('/insertAdmin', passport.checkAuthIsDone, upload.single('profile_image'), insertAdmin);

route.get('/deleteAdmin/:id', passport.checkAuthIsDone, deleteAdmin);

route.get('/editAdmin/:adminId', passport.checkAuthIsDone, editAdminPage);
route.post('/editAdmin/:adminId', passport.checkAuthIsDone, upload.single('profile_image'), updateAdmin);


route.use('/category', passport.checkAuthIsDone, require("./category.routes"));
route.use('/subCategory', passport.checkAuthIsDone, require("./subCategory.routes"));
route.use('/extraCategory', passport.checkAuthIsDone, require("./extraCategory.routes"));
route.use('/products', passport.checkAuthIsDone, require("./products.routes"));

module.exports = route;