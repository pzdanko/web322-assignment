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

    let errorCount = 0;
    let logErrors = {
        email: [],
        psw: []
    }

    if (req.body.logEmail == "") {
        logErrors.email.push("You must enter an email.");
        errorCount++;
    }
    if (req.body.logpsw == "") {
        logErrors.psw.push("You must enter a password.");
        errorCount++;
    }

    if (errorCount > 0) {
        res.render("login", {
            title: "Login",
            email: req.body.logEmail,
            emailError: logErrors.email,
            psw: req.body.logpsw,
            pswError: logErrors.psw
        })
    } else {
        res.redirect('/');
    }
})

app.post("/userRegister", (req, res) => {

    let errorCount = 0;
    let regErrors = {
        fname: [],
        lname: [],
        email: [],
        psw: []
    }

    if (req.body.fname == "") {
        regErrors.fname.push("First name field is required.");
        errorCount++;
    }
    if (req.body.lname == "") {
        regErrors.lname.push("Last name field is required.");
        errorCount++;
    }
    if (req.body.regEmail == "") {
        regErrors.email.push("Email field is required.");
        errorCount++;
    }
    if (req.body.regpsw == "") {
        regErrors.psw.push("Password field is required.");
        errorCount++;
    } else {
        if (req.body.regpsw.length > 12 || req.body.regpsw.length < 6) {
            regErrors.psw.push("Password must be between 6 to 12 characters.");
            errorCount++;
        }
        const regexLower = /[a-z]/g;
        const regexUpper = /[A-Z]/g;
        const regexNum = /[0-9]/g;
        if (!req.body.regpsw.match(regexLower) || !req.body.regpsw.match(regexUpper) || !req.body.regpsw.match(regexNum)) {
            regErrors.psw.push("Password must contain an uppercase letter, a lowercase letter, and a number.");
            errorCount++;
        }
    }

    if (errorCount > 0) {
        res.render("registration", {
            title: "Registration",
            fname: req.body.fname,
            fnameError: regErrors.fname,
            lname: req.body.lname,
            lnameError: regErrors.lname,
            email: req.body.regEmail,
            emailError: regErrors.email,
            psw: req.body.regpsw,
            pswError: regErrors.psw
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