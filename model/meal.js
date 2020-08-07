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

const mealModel = mongoose.model("vf_meals", mealsSchema);
module.exports = mealModel;