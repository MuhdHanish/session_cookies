// Importing express module 
const express = require("express") 

// Setting up the server 
var app = express() 


app.get(`/`, (req, res) => {
    res.send(`Hello World`);
})

// Server setup 
app.listen(3000, () => { 
    console.log(`Server is Running on http://localhost:3000`);
})
