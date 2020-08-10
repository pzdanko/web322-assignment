const express = require('express');
const router = express.Router();

const mealModel = require("../model/mealModel");

const ensureAdmin = require("../middleware/ensureAdmin");
const ensureLogin = require("../middleware/ensureLogin");
const e = require('express');
const { route } = require('./user');

router.get("/all", (req, res) => {
    let allMeals = [];
    mealModel.find()
        .then((meals) => {
            allMeals = meals.map(meal => {
                return {
                    _id: meal._id,
                    title: meal.title,
                    description: meal.description,
                    price: meal.price,
                    imgCode: meal.imgCode
                }
            });

            res.render("meals", {
                title: "Valhalla Meals",
                meals: allMeals,
                user: req.session.user
            });
        });
});

router.get("/admin", ensureAdmin, (req, res) => {
    let allMeals = [];
    mealModel.find()
        .then((meals) => {
            allMeals = meals.map(meal => {
                return {
                    _id: meal._id,
                    title: meal.title,
                    description: meal.description,
                    price: meal.price,
                    imgCode: meal.imgCode
                }
            });

            res.render("adminMeals", {
                title: "Admin Meals Menu",
                meals: allMeals,
                user: req.session.user
            });
        });
});

router.get("/add", ensureAdmin, (req, res) => {
    res.render("addMeal", {
        title: "Add Meal",
        user: req.session.user
    });
});

router.get("/edit/:_id", ensureAdmin, (req, res) => {
    mealModel.findById(req.params._id)
        .exec()
        .then((meal) => {
            if (!meal) {
                console.log("Error finding meal");
            } else {
                let editMeal = {
                    _id: meal._id,
                    title: meal.title,
                    description: meal.description,
                    price: meal.price,
                    imgCode: meal.imgCode
                }
                console.log(editMeal);
                res.render("editMeal", {
                    title: "Edit meal",
                    user: req.session.user,
                    meal: editMeal
                });
            }
        });
});

router.post("/add", ensureAdmin, (req, res) => {
    let errorCount = 0;
    let addErrors = {
        name: [],
        price: [],
        desc: [],
        img: [],
        valid: []
    }

    if (req.body.addMealName == "") {
        addErrors.name.push("You must enter a name.");
        errorCount++;
    }
    if (req.body.addMealPrice == "") {
        addErrors.price.push("You must enter a price.");
        errorCount++;
    }
    if (req.body.addMealDesc == "") {
        addErrors.desc.push("You must enter a description.");
        errorCount++;
    }
    if (!req.body.addMealImg) {
        addErrors.img.push("You must pick an image.");
        errorCount++;
    }

    if (errorCount == 0) {
        let newMeal = new mealModel({
            title: req.body.addMealName,
            price: req.body.addMealPrice,
            description: req.body.addMealDesc,
            featured: req.body.addMealFeat,
            imgCode: req.body.addMealImg
        });
        newMeal.save((err) => {
            if (err) {
                addErrors.valid.push("A meal already has this name.");
                res.render("addMeal", {
                    title: "Add Meal",
                    mealName: req.body.addMealName,
                    mealPrice: req.body.addMealPrice,
                    mealDesc: req.body.addMealDesc,
                    validError: addErrors.valid
                });
            } else {
                res.redirect("/meals/all");
            }
        })
    } else {
        res.render("addMeal", {
            title: "Add Meal",
            mealName: req.body.addMealName,
            mealPrice: req.body.addMealPrice,
            mealDesc: req.body.addMealDesc,
            nameError: addErrors.name,
            priceError: addErrors.price,
            descError: addErrors.desc,
            imgError: addErrors.img,
            user: req.session.user
        });
    }
});

router.post("/edit/:_id", ensureAdmin, (req, res) => {
    let errorCount = 0;
    let editErrors = {
        name: [],
        price: [],
        desc: [],
        valid: []
    }

    if (req.body.editMealName == "") {
        editErrors.name.push("You must enter a name.");
        errorCount++;
    }
    if (req.body.editMealPrice == "") {
        editErrors.price.push("You must enter a price.");
        errorCount++;
    }
    if (req.body.editMealDesc == "") {
        editErrors.desc.push("You must enter a description.");
        errorCount++;
    }

    if (errorCount == 0) {
        mealModel.updateOne({ _id: req.params._id }, {
            title: req.body.editMealName,
            price: req.body.editMealPrice,
            description: req.body.editMealDesc,
            featured: req.body.editMealFeat
        })
            .exec()
            .then(() => {
                redirect("/user/dashboard");
            })
            .catch((err) => {
                editErrors.valid.push("A meal already uses this name");
                mealModel.findById(req.params._id)
                .exec()
                .then((meal) => {
                    if (err) {
                        console.log("Error finding meal");
                    } else {
                        res.render("editMeal")({
                            title: "Edit meal",
                            user: req.session.user,
                            meal: meal
                        });
                    }
                });
            })
    } else {
        res.render("addMeal", {
            title: "Add Meal",
            mealName: req.body.addMealName,
            mealPrice: req.body.addMealPrice,
            mealDesc: req.body.addMealDesc,
            nameError: addErrors.name,
            priceError: addErrors.price,
            descError: addErrors.desc,
            imgError: addErrors.img,
            user: req.session.user
        });
    }
});

module.exports = router;
