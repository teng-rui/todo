//jshint esversion:6

require("dotenv").config();

const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


mongoose.set('strictQuery', false);
const dbURL = process.env.DATABASE;
mongoose.connect(dbURL, { useNewUrlParser: true });
const planSchema = new mongoose.Schema({
    content: String
});
const Plan = mongoose.model('Plan', planSchema);
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    plans: [{
        type: mongoose.ObjectId,
        ref: 'Plan'
    }]
});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports={User:User,Plan:Plan,passport:passport};