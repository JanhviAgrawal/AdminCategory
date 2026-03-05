const express = require('express');

require('dotenv').config();
const path = require('path');
require('./config/db.config');

const cookieparser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

const flash = require('connect-flash');
const { setFlash } = require('./milddleware/connectFlash.middleware');

require('./milddleware/passport.local.middleware');

const app = express();
const PORT = 8000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cookieparser());

app.use(session({
    name: "AdminSession",
    secret: "AdminSession#@12345",
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.currentAdmin);
app.use(setFlash);

app.use('/', require('./routes/index'));

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log("Server not Started", err);
        return;
    }
    console.log("Server is Started on PORT ", process.env.PORT);
});