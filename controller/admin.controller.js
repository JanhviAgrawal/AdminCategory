const Admin = require('../model/admin.model');
const fs = require('fs');
const nodemailer = require('nodemailer');

// Session remove 
function sessionRemove(req, res) {
    console.log("Session Removed..");

    req.session.destroy((err) => {
        if (!err) {
            console.log("Session Removed..");
            return res.redirect('/');
        }
        console.log("Error: ", err);
    });
}

// Login Page
module.exports.loginPage = async (req, res) => {
    try {
        return res.render('auth/login');
    } catch (err) {
        console.log("Something went Wrong..", err);
        return res.render('auth/login');
    }
};

// Login - dashboard
module.exports.checkLogin = async (req, res) => {
    try {
        req.flash('success', "Loged in Successfully..!");
        return res.redirect('/dashboard');
    } catch (err) {
        req.flash('error', "Loged in Failed..!");
        console.log("Something went Wrong..", err);
        return res.render('/');
    }
};

// Change Password Page
module.exports.changePasswordPage = async (req, res) => {
    try {
        res.render('profile/changePasswordPage');
    } catch (err) {
        console.log("Something went wrong..", err);
        return res.render('/dashboard');
    }
};

// Change Password Logic
module.exports.changePassword = async (req, res) => {
    try {
        let admin = res.locals.admin;

        if (!admin) {
            req.flash('error', "No admin found !");
            return res.redirect('/');
        }

        const { current_psw, new_psw, confirm_psw } = req.body;

        if (current_psw !== admin.password) {
            req.flash('error', "Current Password and Old password did not match.");
            return res.redirect('/change-password');
        }

        if (new_psw === admin.password) {
            req.flash('error', "New password cannot be the same as the old password.");
            return res.redirect('/change-password');
        }

        if (new_psw !== confirm_psw) {
            req.flash('error', "New password and confirm password did not match.");
            return res.redirect('/change-password');
        }

        const adminChangePassword = await Admin.findByIdAndUpdate(admin._id, { password: new_psw }, { new: true });

        if (adminChangePassword) {
            req.flash('success', "Password Changed");
            console.log("Password changed for ID:", admin._id);
            return sessionRemove(req, res);
        } else {
            req.flash('error', "Password Updation Failed");
            console.log("Update failed.");
            return res.redirect('/dashboard');
        }

    } catch (err) {
        req.flash('error', "Something Went Wrong..!");
        console.log("Something went wrong..", err);
        return res.render('/dashboard');
    }
};

// Verify Email
module.exports.verifyEmail = async (req, res) => {
    console.log(req.body);
    try {
        const myAdmin = await Admin.findOne({ email: req.body.email });

        if (!myAdmin) {
            req.flash('error', "Admin not Found");
            console.log("Admin not found");
            return res.redirect('/');
        }

        const OTP = Math.floor(100000 + Math.random() * 900000);

        req.session.otp = OTP.toString();
        req.session.adminId = myAdmin._id;

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                
            }
        });

        const info = await transporter.sendMail({
            from: 'Admin Panel',
            to: req.body.email,
            subject: "OTP Verification",
            html: `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                        <meta charset="UTF-8">
                        <title>Verification Code</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        </head>
                        <body style="margin:0;padding:0;background-color:#f8f6f6;font-family:Arial, Helvetica, sans-serif;">

                        <!-- Wrapper -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f6f6;padding:20px;">
                            <tr>
                            <td align="center">

                                <!-- Card -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;">

                                <!-- Header -->
                                <tr>
                                    <td style="background:#f6cdcb;padding:24px;text-align:center;">
                                    <h2 style="margin:0;color:#201212;font-size:22px;font-weight:bold;">
                                        AdminCore
                                    </h2>
                                    </td>
                                </tr>

                                <!-- Body -->
                                <tr>
                                    <td style="padding:32px;text-align:center;color:#5D6B6B;">

                                    <h1 style="margin:0 0 16px;font-size:28px;color:#201212;">
                                        Verification Code
                                    </h1>

                                    <p style="margin:0 0 32px;font-size:16px;line-height:24px;">
                                        Please use the following one-time password to complete your secure verification.
                                        This code is valid for <strong>10 minutes</strong>.
                                    </p>

                                    <!-- OTP Box -->
                                    <table align="center" cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
                                        <tr>
                                        <td style="
                                            background-color:#f6cdcb;
                                            border-radius:10px;
                                            padding:16px 32px;
                                            font-size:32px;
                                            letter-spacing:6px;
                                            font-weight:bold;
                                            color:#201212;
                                        ">
                                            ${OTP}
                                        </td>
                                        </tr>
                                    </table>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="padding:20px;text-align:center;background-color:#fafafa;color:#999999;font-size:11px;">
                                    © 2024 AdminCore Systems Inc.<br><br>
                                    This is an automated message. Please do not reply.
                                    </td>
                                </tr>

                                </table>

                            </td>
                            </tr>
                        </table>

                        </body>
                        </html>
                        `
        });

        return res.redirect('/otp-page');
    } catch (err) {
        return res.render('/');
    }
};

// Otp page rendering
module.exports.OTPpage = (req, res) => {
    try {
        return res.render('auth/OTPpage');

    } catch (err) {
        console.log("Something went Wrong..", err);
        return res.redirect('/');
    }
};

// Forgot Password Page (Public)
module.exports.forgetPage = (req, res) => res.render('auth/forgetPage');

// OTP logic 
module.exports.OTPVerify = (req, res) => {
    try {
        const userOTP = req.body.adminOTP;
        const sessionOTP = req.session.otp;

        if (!sessionOTP || userOTP !== sessionOTP) {
            req.flash('error', "OTP not Matched");
            console.log("OTP mismatch");
            return res.redirect('/otp-page');
        }
        req.session.otpVerified = true;
        return res.redirect('/newPasswordPage');

    } catch (err) {
        console.log("Something went Wrong..", err);
        return res.redirect('/');
    }
};

// rendering resetpassword page
module.exports.newPasswordPage = async (req, res) => {
    try {
        if (!req.session.otpVerified) {
            console.log("Unauthorized access to reset page");
            return res.redirect('/');
        }
        return res.render('auth/resetPassword');
    } catch (err) {
        console.log("Something went Wrong..", err);
        return res.redirect('/');
    }
};

// reset password logic
module.exports.changeNewPassword = async (req, res) => {
    try {
        const { new_password, confirm_password } = req.body;
        if (new_password !== confirm_password) {
            req.flash('error', "Password do not match");
            console.log("Passwords do not match");
            return res.redirect('/newPasswordPage');
        }

        const adminId = req.session.adminId;

        if (!adminId) {
            console.log("Session expired or invalid");
            return res.redirect('/');
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(adminId, { password: new_password });

        if (updatedAdmin) {
            req.flash('success', "Password Updated");
            console.log("Password updated..");
            return sessionRemove(req, res);
        } else {
            console.log("Admin record not found");
            return res.redirect('/');
        }
    } catch (err) {
        console.log("Something went Wrong..", err);
        return res.redirect('/');
    }
};

// Profile Page
module.exports.profilePage = async (req, res) => {
    try {
        return res.render('profile/profilePage');
    } catch (err) {
        console.log("Something went Wrong..", err);
        res.redirect('/profile');
    }
};

// logout 
module.exports.logout = (req, res) => {
    sessionRemove(req, res);
};

// Dashboard
module.exports.dashboardPage = async (req, res) => {
    try {
        console.log(req.user);
        return res.render('dashboard');
    } catch (err) {
        console.log("Something went Wrong..", err);
        return res.render('/');
    }
};

// Add Admin Page
module.exports.addAdminPage = async (req, res) => {
    try {
        return res.render('admin/addAdminPage');
    } catch (err) {
        console.log("Something went Wrong..", err);
        return res.render('/dashboard');
    }
};

// View Admins
module.exports.viewAdminPage = async (req, res) => {
    try {

        let allAdmin = await Admin.find();
        allAdmin = allAdmin.filter((subadmin) => subadmin.email != res.locals.admin.email);

        return res.render('admin/viewAdminPage', { allAdmin });
    } catch (err) {
        console.log("Something went Wrong..", err);
        return res.render('/dashboard');
    }
};

// Insert Admin
module.exports.insertAdmin = async (req, res) => {
    try {
        console.log(req.file);

        req.body.profile_image = req.file.path;

        const addAdmin = await Admin.create(req.body);

        if (addAdmin) {
            req.flash('success', "Admin Inserted Successfully..");
            console.log("Admin Inserted Successfully..");
        } else {
            req.flash('error', "Admin Insertion Failed..");
            console.log("Admin Insertion Failed..");
        }

        return res.redirect('/addAdminPage');
    } catch (err) {
        console.log("Something went Wrong..", err);
        return res.render('/addAdminPage');
    }
};

// Delete Admin logic
module.exports.deleteAdmin = async (req, res) => {
    try {
        const deletedUser = await Admin.findByIdAndDelete(req.query.adminId);

        console.log(deletedUser);

        if (deletedUser) {

            fs.unlink(deletedUser.profile_image, () => { });
            req.flash('success', "Admin deleted successfully...");
            console.log("Admin deleted successfully...");
        }

        return res.redirect('/viewAdminPage');
    } catch (err) {
        console.log("Something went Wrong..", err);
        return res.render('/viewAdminPage');
    }
};

// Edit Admin Page
module.exports.editAdminPage = async (req, res) => {
    try {
        console.log(req.params);

        const singleAdmin = await Admin.findById(req.params.adminId);
        return res.render('admin/editAdminPage', { singleAdmin });
    } catch (err) {
        console.log("Something went Wrong..", err);
        return res.redirect('/viewAdminPage');
    }
};

// Update Admin logic
module.exports.updateAdmin = async (req, res) => {
    try {
        if (req.file) {
            req.body.profile_image = req.file.path;
            const oldAdmin = await Admin.findById(req.params.adminId);
            const updateAdmin = await Admin.findByIdAndUpdate(req.params.adminId, req.body);
            if (updateAdmin) {
                fs.unlink(oldAdmin.profile_image, () => { });
                req.flash('success', "Admin edited successfully...");
                console.log("Admin Updated Successfully..");
            }
        } else {
            req.flash('success', "Admin edited Successfully.");
            await Admin.findByIdAndUpdate(req.params.adminId, req.body);
        }

        if (req.params.adminId === res.locals.admin.id) {
            return res.redirect('/profile');
        } else {
            return res.redirect('/viewAdminPage');
        }

    } catch (err) {
        console.log("Error: ", err);
        return res.redirect('/viewAdminPage');
    }
};