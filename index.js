// Importing express module 
const express = require("express");
// Import express-session module
const session = require("express-session");
// Import mongoose module
const mongoose  = require("mongoose");

// Setting up the server 
const app = express();

// Connect mongodb using mongoose
mongoose.connect(`mongodb://127.0.0.1:27017/session_cookies`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(_res => console.log(`MongoDB connected successfully 🟢`))
    .catch(error => console.log(`Unable to connect to MongoDB 🔴`, error));

// Middleware
app.use(session({
    secret: `Hello World`,
    resave: false,
    saveUninitialized: false
}));

// Handlers
app.get(`/`, (req, res) => {
    req.session.isAuth = true;
    res.send(`Hello World`);
})

// Server setup 
app.listen(3000, () => {
    console.log(`Server is Running on http://localhost:3000 🚀`);
});
