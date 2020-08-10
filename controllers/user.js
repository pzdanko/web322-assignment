const express = require('express');
const router = express.Router();
const brcrypt = require('bcryptjs');

const userModel = require("../model/userModel");

const ensureAdmin = require("../middleware/ensureAdmin");
const ensureLogin = require("../middleware/ensureLogin");

router.get("/login", (req, res) => {
    res.render("login", {
        title: "Login",
        user: req.session.user
    })
});

//registration
router.get("/registration", (req, res) => {
    res.render("registration", {
        title: "Registration",
        user: req.session.user
    })
});

router.get("/logout", (req, res) => {
    req.session.reset();
    res.redirect("/user/login");
})

router.get("/dashboard", ensureLogin, (req, res) => {
    if (req.session.user.admin) {
        res.redirect("/user/adminDashboard")
    } else {
        res.redirect("/user/userDashboard")
    }
});

router.get("/userDashboard", ensureLogin, (req, res) => {
    res.render("userDashboard", {
        title: "User Dashboard",
        user: req.session.user
    })
});

router.get("/adminDashboard", ensureAdmin, (req, res) => {
    res.render("adminDashboard", {
        title: "Admin Dashboard",
        user: req.session.user
    })
});


router.post("/userLogin", (req, res) => {

    let errorCount = 0;
    let logErrors = {
        email: [],
        psw: [],
        valid: []
    }

    if (req.body.logEmail == "") {
        logErrors.email.push("You must enter an email.");
        errorCount++;
    }
    if (req.body.logpsw == "") {
        logErrors.psw.push("You must enter a password.");
        errorCount++;
    }

    if (errorCount == 0) {
        userModel.findOne({ email: req.body.logEmail.toLowerCase() })
            .exec()
            .then((user) => {
                if (user) {
                    brcrypt.compare(req.body.logpsw, user.password)
                        .then((result) => {
                            if (result) {
                                req.session.user = {
                                    fname: user.fname,
                                    lname: user.lname,
                                    email: user.email,
                                    admin: user.admin
                                };
                                res.redirect("/user/dashboard");
                            } else {
                                logErrors.valid.push("Invalid email or password.");
                                res.render("login", {
                                    title: "Login",
                                    email: req.body.logEmail,
                                    psw: req.body.logpsw,
                                    validError: logErrors.valid,
                                    user: req.session.user
                                });
                            }
                        });
                } else {
                    logErrors.valid.push("Invalid email or password.");
                    res.render("login", {
                        title: "Login",
                        email: req.body.logEmail,
                        psw: req.body.logpsw,
                        validError: logErrors.valid,
                        user: req.session.user
                    });
                }
            })
    } else {
        res.render("login", {
            title: "Login",
            email: req.body.logEmail,
            emailError: logErrors.email,
            psw: req.body.logpsw,
            pswError: logErrors.psw,
            user: req.session.user
        });
    }
})

router.post("/userRegister", (req, res) => {

    let errorCount = 0;
    let regErrors = {
        fname: [],
        lname: [],
        email: [],
        psw: [],
        valid: []
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
            pswError: regErrors.psw,
            user: req.session.user
        })
    } else {
        //saving user to MongoDB
        brcrypt.genSalt(10)
            .then(salt => brcrypt.hash(req.body.regpsw, salt))
            .then(hash => {
                let newUser = new userModel({
                    fname: req.body.fname,
                    lname: req.body.lname,
                    email: req.body.regEmail.toLowerCase(),
                    password: hash
                });
                newUser.save((err) => {
                    if (err) {
                        regErrors.valid.push(`${req.body.regEmail.toLowerCase()} is already in use.`);
                        res.render("registration", {
                            title: "Registration",
                            fname: req.body.fname,
                            lname: req.body.lname,
                            email: req.body.regEmail,
                            psw: req.body.regpsw,
                            validError: regErrors.valid,
                            user: req.session.user
                        })
                    } else {
                        //sending welcome email
                        const sgMail = require('@sendgrid/mail');
                        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                        const msg = {
                            to: `${req.body.regEmail}`,
                            from: 'pzdanko@hotmail.com',
                            subject: 'Welcome to Valhalla Feasts!',
                            html: `<h2>Thank you for signing up ${req.body.fname} ${req.body.lname}!</h2>
                                <p>We're excited that this is working and don't have anything else to say!</p>
                                <p>Bye!</p>
                                <p>Yours truly, the Valhalla Feasts team</p>`,
                        };
                        sgMail.send(msg)
                            .then(() => {
                                res.redirect("/user/login");
                            })
                            .catch(err => {
                                console.log(`Error ${err}`);
                            });
                    }
                });
            })
            .catch(err => {
                console.log(`Error hashing ---> ${err}`);
            })
    }
});

module.exports = router;