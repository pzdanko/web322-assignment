const ensureLogin = require("./ensureLogin");

const ensureAdmin = (req, res, next) => {
    if (req.session.user.admin) {
        next();
    } else {
        res.redirect("/user/dashboard");
    }
}

module.exports = ensureAdmin;