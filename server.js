const express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

require('dotenv').config({path:"./config/keys.env"});

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

app.get("/dashboard", (req, res) => {
    res.render("dashboard", {
        title: "Dashboard"
    })
});

app.post("/userLogin", (req, res) => {

    const logErrors = [];

    if (req.body.logEmail == "") {
        logErrors.push("You must enter an email.")
    }
    if (req.body.logpsw == "") {
        logErrors.push("You must enter a password.")
    }

    if (logErrors.length > 0) {
        res.render("login", {
            title: "Login",
            errors: logErrors,
            email: req.body.logEmail,
            psw: req.body.logpsw
        })
    } else {
        res.redirect('/');
    }
})

app.post("/userRegister", (req, res) => {

    const regErrors = [];

    if (req.body.fname == "") {
        regErrors.push("First name field is required.")
    }
    if (req.body.lname == "") {
        regErrors.push("Last name field is required.")
    }
    if (req.body.regEmail == "") {
        regErrors.push("Email field is required.")
    }
    if (req.body.regpsw == "") {
        regErrors.push("Password field is required.")
    } else {
        if (req.body.regpsw.length > 12 || req.body.regpsw.length < 6) {
            regErrors.push("Password must be between 6 to 12 characters.");
        }
        const regexLower = /[a-z]/g;
        const regexUpper = /[A-Z]/g;
        const regexNum = /[0-9]/g;
        if (!req.body.regpsw.match(regexLower) || !req.body.regpsw.match(regexUpper) || !req.body.regpsw.match(regexNum)) {
            regErrors.push("Password must contain an uppercase letter, a lowercase letter, and a number.");
        }
    }

    if (regErrors.length > 0) {
        res.render("registration", {
            title: "Registration",
            errors: regErrors,
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.regEmail,
            psw: req.body.regpsw
        })
    } else {
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: `${req.body.regEmail}`,
            from: 'pzdanko@hotmail.com',
            subject: 'Welcome to Valhalla Feasts!',
            html: 
            `<h2>Thank you for signing up ${req.body.fname} ${req.body.lname}!</h2>
            <p>We're excited that this is working and don't have anything else to say!</p>
            <p>Bye!</p>
            <p>Yours truly, the Valhalla Feasts team</p>`,
        };
        sgMail.send(msg)
        .then(()=>{
            res.redirect("/dashboard");;
        })
        .catch(err=>{
            console.log(`Error ${err}`);
        });
    }
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Web Server is up and running");
})