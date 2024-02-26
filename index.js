// Importing express module 
const express = require("express");
// Import express validator
const { body, validationResult } = require('express-validator');
// Import express-session module
const session = require("express-session");
// Import mongoose module
const mongoose = require("mongoose");
// Import Bcrypt Js module
const bcrypt = require("bcryptjs");
// Import mongodb session manage module
const MongoDBSession = require("connect-mongodb-session")(session);
// Import user Model
const UserModel = require(`./models/user`);

// Setting up the server 
const app = express();

// Connect mongodb using mongoose
const mongoURI = `mongodb://127.0.0.1:27017/session_cookies`
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(_res => console.log(`MongoDB connected successfully 🟢`))
    .catch(error => console.error(`Unable to connect to MongoDB 🔴`, error));

// Store variable to handle mongodb session
const store = new MongoDBSession({
    uri: mongoURI,
    collection: `my_sessions`
});

// View engine setup
app.set("view engine", "ejs");

// Application level middlewares
// - body parse
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// - session 
app.use(session({
    secret: `session_cookies`,
    resave: false,
    saveUninitialized: false,
    store
}));
// Router lever middlewares
// - Authenticaion
const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        return next();
    } else {
        return res.redirect(`/login`);
    }
}
const isNotAuth = (req, res, next) => {
    if (!req.session.isAuth) {
        return next();
    } else {
        return res.redirect(`/`);
    }
}

// Handlers
// GET
// Get Dashboard Page
app.get(`/`, isAuth, (req, res) => {
    const { user } = req.session;
    res.render(`dashboard`, { serverVariable: `Hello ${user.email} 👋` });
});
// Get Login Page
app.get(`/login`, isNotAuth, (req, res) => {
    res.render(`login`, { errorMessage: null, email: '', password: '' });
});
// Get Signup Page
app.get(`/signup`, isNotAuth, (req, res) => {
    res.render(`signup`, { errorMessage: null, email: '', password: '', confirmPassword: '' });
});

// POST
// Signup Post Api
app.post(`/signup`,
    // Validation middleware (better to write in another file of middlewares)
    [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('confirmPassword').isLength({ min: 6 })
    ], async (req, res) => {
    try {
        let { email, password, confirmPassword } = req.body;
         // Checking api validation result
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
             // For api validation error, render the signup page again with a generic error message
            return res.render('signup', { errorMessage: 'Please fill in all fields', email, password, confirmPassword });
        }
        password = await bcrypt.hash(password, 12);
        const user = new UserModel({
            email,
            password
        });
        // Save the new user to the database
        await user.save();
        return res.redirect(`/login`);  // Redirect the user to the login page
    } catch (error) {
        console.error(error);
        const { email, password, confirmPassword } = req.body;
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            // If the error is due to duplicate email, render the signup page again with the error message
            return res.render('signup', { errorMessage: 'Email is already registered', email, password, confirmPassword });
        } else {
            // For other errors, render the signup page again with a generic error message
            return res.render('signup', { errorMessage: 'An error occurred. Please try again later', email, password, confirmPassword });
        }
    }
});
// Login Post Api
app.post(`/login`,
    // Validation middleware (better to write in another file of middlewares)
    [
    body('email').isEmail(),
    body('password').notEmpty(),
    ], async (req, res) => {
    try {
        const { email, password } = req.body;
        // Checking api validation result
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
             // For api validation error, render the login page again with a generic error message
            return res.render('login', { errorMessage: 'Please fill in all fields', email, password });
        }
        // Find the user by email
        const user = await UserModel.findOne({ email });
        // If user is not found or password does not match
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.render('login', { errorMessage: 'Invalid email or password', email, password });
        } else {
            req.session.user = user;
            req.session.isAuth = true;
            // Authentication successful, redirect to the home page
            return res.redirect(`/`);
        }
    } catch (error) {
        console.error(error);
        const { email, password } = req.body;
        // For other errors, render the login page again with a generic error message
        return res.render('login', { errorMessage: 'An error occurred. Please try again later', email, password });
    }
});
// Logout Post Api
app.post(`/logout`, (req, res) => {
    try {
        // Destroying the session and redirecting to login
        req.session.destroy()
        return res.redirect(`/login`);
    } catch (error) {
        console.error(error);
        return res.redirect(`/`);
    }
});

// Server setup 
app.listen(3000, () => {
    console.log(`Server is Running on http://localhost:3000 🚀`);
});
