//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const session = require("express-session");

const {User,Plan,passport}=require(__dirname+'/app/models/todoDB.js');


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
    secret: process.env.SECRET,//change later
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", require(__dirname+'/app/routes/main.js'));
app.use("/register", require(__dirname+'/app/routes/register.js'));
app.use("/login", require(__dirname+'/app/routes/login.js'));
app.use("/plan", require(__dirname+'/app/routes/plan.js'));
app.use("/delete", require(__dirname+'/app/routes/delete.js'));

app.listen(3000, function () {
    console.log("server started");
});
