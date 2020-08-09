const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mealSchema = new Schema({
    "title": {
        "type": String,
        "unique": true
    },
    "description": String,
    "price": Number,
    "featured": Boolean,
    "imgCode": String
})

module.exports = mongoose.model('vf_meals', mealSchema);