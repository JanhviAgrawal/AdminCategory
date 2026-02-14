const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const Admin = require('../model/admin.model');

passport.use('localAuth', new localStrategy({
    usernameField: "email",
}, async (email, password, done) => {
    console.log("Email : ", email);
    console.log("Password : ", password);

    const admin = await Admin.findOne({ email });

    if (!admin) {
        console.log("Admin not found");
        return done(null, false);
    }

    if (password !== admin.password) {
        console.log("Password is wrong");
        return done(null, false);
    }

    return done(null, admin);
}));

passport.serializeUser((admin, done) => {
    console.log("Admin Serialize : ", admin);

    return done(null, admin.id);
});

passport.deserializeUser(async (adminId, done) => {
    console.log("Deserialize : ", adminId);

    const currentAdmin = await Admin.findById(adminId);

    console.log("Current Admin : ", currentAdmin);

    return done(null, currentAdmin);
});

passport.checkAuthIsDone = (req, res, next) => {
    console.log("Is Authenticated : ", req.isAuthenticated());

    if (req.isAuthenticated()) {
        return next();
    }

    return res.redirect('/');
}

passport.checkAuthIsNotDone = (req, res, next) => {
    console.log("Is Authenticated : ", req.isAuthenticated());
    if (!req.isAuthenticated()) {
        return next(); // here
    }

    return res.redirect('/dashboard');
}

passport.currentAdmin = (req, res, next) => {
    console.log("Current Admin");

    if (req.isAuthenticated()) {
        res.locals.admin = req.user;
    }
    next();
}

passport.isOtpGenerated = (req, res, next) => {
    if (req.session && req.session.otp) {
        return next();
    }
    return res.redirect('/');
}

passport.isOtpVerified = (req, res, next) => {
    if (req.session && req.session.otpVerified) {
        return next();
    }
    return res.redirect('/otp-page');
}