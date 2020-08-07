const express = require('express');
const router = express.Router();

const meals = require("../model/meals");

router.get("/", (req, res) => {
    res.render("home", {
        title: "Valhalla Feasts",
        topMeals: meals.getTopMeals(),
        perks: meals.getAllPerks()
    })
});

module.exports = router;