const express = require('express');
const router = express.Router();

const mealModel = require("../model/mealModel");

router.get("/", (req, res) => {
  let featuredMeals = [];
  mealModel.find({ featured: 'true' })
    .then((meals) => {
      featuredMeals = meals.map(meal => {
        return {
          title: meal.title,
          price: meal.price,
          imgCode: meal.imgCode,
        }
      });

      res.render("home", {
        title: "Valhalla Feasts",
        topMeals: featuredMeals,
        user: req.session.user
      });
    });
});

module.exports = router;