const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    "fname": String,
    "lname": String,
    "email": {
        "type": String,
        "unique": true
    },
    "password": String,
    "admin": {
        "type": Boolean,
        "default": false
    }
})

module.exports = mongoose.model('vf_users', userSchema);