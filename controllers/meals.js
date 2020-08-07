const express = require('express');
const router = express.Router();

const mealModel = require("../model/meal");

router.get("/all", (req, res) => {
    let allMeals = [];
    mealModel.find()
        .then((meals) => {
            allMeals = meals.map(meal => {
                return {
                    title: meal.title,
                    description: meal.description,
                    price: meal.price,
                    imgCode: meal.imgCode
                }
            });

            res.render("meals", {
                title: "Valhalla Meals",
                meals: allMeals
            });
        });
});

module.exports = router;
