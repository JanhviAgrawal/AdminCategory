const express = require('express');
const multer = require('multer');
const { loginPage, checkLogin, logout, dashboardPage, profilePage, changePasswordPage, changePassword, forgetPage, verifyEmail, OTPpage, OTPVerify, newPasswordPage, changeNewPassword, addAdminPage, viewAdminPage, insertAdmin, deleteAdmin, editAdminPage, updateAdmin } = require('../controller/admin.controller');
const upload = require('../milddleware/multer.middleware');
const passport = require('passport');

const route = express.Router();
// Auth (login) 
route.get('/', passport.checkAuthIsNotDone, loginPage);
route.post('/login', passport.checkAuthIsNotDone, passport.authenticate("localAuth", {
    failureRedirect: "/"
}), checkLogin);

// Routes
// Change Password
route.get('/change-password', passport.checkAuthIsDone, changePasswordPage);
route.post('/change-password', passport.checkAuthIsDone, changePassword);

// Forget Password
route.get('/verify-email', passport.checkAuthIsNotDone, forgetPage);
route.post('/verify-email', passport.checkAuthIsNotDone, verifyEmail);

//OTP page
// route.get('/otp-page', passport.checkAuthIsNotDone, OTPpage);
// route.post('/otp-verify', passport.checkAuthIsNotDone, OTPVerify);
route.get('/otp-page', passport.checkAuthIsNotDone, passport.isOtpGenerated, OTPpage);
route.post('/otp-verify', passport.checkAuthIsNotDone, passport.isOtpGenerated, OTPVerify);


// new Password page
// route.get('/newPasswordPage', passport.checkAuthIsNotDone, newPasswordPage);
// route.post('/change-new-password', passport.checkAuthIsNotDone, changeNewPassword);
route.get('/newPasswordPage', passport.checkAuthIsNotDone, passport.isOtpVerified, newPasswordPage);
route.post('/change-new-password', passport.checkAuthIsNotDone, passport.isOtpVerified, changeNewPassword);

// Profile Page
route.get('/profile', passport.checkAuthIsDone, profilePage);

//Logout
route.get('/logout', passport.checkAuthIsDone, logout);

//dashboard
route.get('/dashboard', passport.checkAuthIsDone, dashboardPage);

// Add and view Page
route.get('/addAdminPage', passport.checkAuthIsDone, addAdminPage);
route.get('/viewAdminPage', passport.checkAuthIsDone, viewAdminPage);

// Insert Admin
route.post('/insertAdmin', upload.single('profile_image'), insertAdmin);

// Delete Admin
route.get('/deleteAdmin', passport.checkAuthIsDone, deleteAdmin);

// Edit Admin
route.get('/editAdmin/:adminId', editAdminPage);
route.post('/editAdmin/:adminId', upload.single('profile_image'), updateAdmin);

module.exports = route;