const express = require('express');
const router = express.Router();

const mealModel = require("../model/meal");

router.get("/", (req, res) => {
  let featuredMeals = [];
  mealModel.find({ featured: 'true' })
    .then((meals) => {
      featuredMeals = meals.map(meal => {
        return {
          title: meal.title,
          price: meal.price,
          imgCode: meal.imgCode
        }
      });

      res.render("home", {
        title: "Valhalla Feasts",
        topMeals: featuredMeals
      });
    });
});

module.exports = router;