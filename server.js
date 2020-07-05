const express = require("express");
const exphbs  = require('express-handlebars');

const meals = require("./model/meals")

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static("public"));

//ROUTES
//home
app.get("/",(req,res)=>{
    res.render("home",{
        title : "Valhalla Feasts",
        topMeals : meals.getTopMeals(),
        perks: meals.getAllPerks()
    })
});

//meal listings
app.get("/meals",(req,res)=>{
    res.render("meals",{
        title : "Meals",
        meals : meals.getAllMeals()
    })
});

//login
app.get("/login",(req,res)=>{
    res.render("login",{
        title : "Login"
    })
});

//registration
app.get("/registration",(req,res)=>{
    res.render("registration",{
        title : "Registration"
    })
});

const PORT=3000;
app.listen(PORT,()=>{
    console.log("Web Server is up and running");
})