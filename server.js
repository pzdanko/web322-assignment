const express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('dotenv').config({path:"./config/keys.env"});

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));

//ROUTES
const generalController = require("./controllers/general");
const mealController = require("./controllers/meals");
const userController = require("./controllers/user");

app.use("/",generalController);
app.use("/meals", mealController);
app.use("/user", userController);


mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(`Connected to MongoDB`);
    })
    .catch(err => console.log(`Error occurred when conecting to mongoDB ${err}`));

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Web Server is up and running");
})