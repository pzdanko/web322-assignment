const express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

//require('dotenv').config({path:"./config/keys.env"});

const meals = require("./model/meals")

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));

//ROUTES
//home
app.get("/", (req, res) => {
    res.render("home", {
        title: "Valhalla Feasts",
        topMeals: meals.getTopMeals(),
        perks: meals.getAllPerks()
    })
});

//meal listings
app.get("/meals", (req, res) => {
    res.render("meals", {
        title: "Meals",
        meals: meals.getAllMeals()
    })
});

//login
app.get("/login", (req, res) => {
    res.render("login", {
        title: "Login"
    })
});

//registration
app.get("/registration", (req, res) => {
    res.render("registration", {
        title: "Registration"
    })
});

app.post("/login", (req, res) => {

    const logErrors = [];

    if (req.body.logEmail == "") {
        logErrors.push("You must enter an email.")
    }
    if (req.body.logpsw == "") {
        logErrors.push("You must enter a password.")
    }

    if (logErrors.length > 0){
        res.render("login", {
            title: "Login",
            errors: logErrors
        })
    } else {
        res.redirect('/');
    }
})

app.post("/login", (req, res) => {

    const logErrors = [];

    if (req.body.logEmail == "") {
        logErrors.push("You must enter an email.")
    }
    if (req.body.logpsw == "") {
        logErrors.push("You must enter a password.")
    }

    if (logErrors.length > 0){
        res.render("login", {
            title: "Login",
            errors: logErrors
        })
    } else {
        redirect("/");
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Web Server is up and running");
})