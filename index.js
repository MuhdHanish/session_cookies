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
    .catch(error => console.log(`Unable to connect to MongoDB 🔴`, error));

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
    secret: `Hello World`,
    resave: false,
    saveUninitialized: false,
    store
}));

// Handlers
// GET
app.get(`/`, (req, res) => {
    res.render(`landing`, { serverVariable: 'Hello from the server' });
});
app.get(`/login`, (req, res) => {
    res.render(`login`, { errorMessage: null, email: '', password: '' });
});
app.get(`/signup`, (req, res) => {
    res.render(`signup`, { errorMessage: null, email: '', password: '', confirmPassword: '' });
});

// POST
app.post(`/signup`,
    // Validation middleware (better to write in another file of middlewares)
    [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('confirmPassword').isLength({ min: 6 })
    ], async (req, res) => {
    try {
        let { email, password, confirmPassword } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('signup', { errorMessage: 'Please fill in all fields', email, password, confirmPassword });
        }
        password = await bcrypt.hash(password, 12);
        const user = new UserModel({
            email,
            password
        });
        // Save the new user to the database
        await user.save();
        res.redirect(`/login`);  // Redirect the user to the login page
    } catch (error) {
        const { email, password, confirmPassword } = req.body;
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            // If the error is due to duplicate email, render the signup page again with the error message
            res.render('signup', { errorMessage: 'Email is already registered', email, password, confirmPassword });
        } else {
            // For other errors, render the signup page again with a generic error message
            res.render('signup', { errorMessage: 'An error occurred. Please try again later.', email, password, confirmPassword });
        }
    }
});
app.post(`/login`, async (req, res) => {
    
});

// Server setup 
app.listen(3000, () => {
    console.log(`Server is Running on http://localhost:3000 🚀`);
});
