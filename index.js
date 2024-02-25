// Importing express module 
const express = require("express");
// Import express-session module
const session = require("express-session");
// Import mongoose module
const mongoose = require("mongoose");
// Import mongodb session manage module
const MongoDBSession = require("connect-mongodb-session")(session);

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
    res.render(`login`);
});
app.get(`/signup`, (req, res) => {
    res.render(`signup`);
});

// POST
app.post(`/login`, (req, res) => {
    
});
app.post(`/signup`, (req, res) => {
    
});

// Server setup 
app.listen(3000, () => {
    console.log(`Server is Running on http://localhost:3000 🚀`);
});
