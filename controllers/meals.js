const express = require('express');
const router = express.Router();

const meals = require("../model/meals");

router.get("/all", (req, res) => {
    res.render("meals", {
        title: "Meals",
        meals: meals.getAllMeals()
    })
});

module.exports = router;
