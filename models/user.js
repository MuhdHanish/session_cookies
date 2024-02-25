// Importing mongoose module
const mongoose = require(`mongoose`);
// Destructuring from mongoose module
const { Schema, model } = mongoose;
// Creating user schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
})

module.exports = model(`user`, userSchema);