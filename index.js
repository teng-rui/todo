//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

// const getPlan=require(__dirname + "/app/getPlans.js")
const date = require(__dirname + '/app/date.js');

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

mongoose.set('strictQuery', false);
const dbURL = "mongodb+srv://ruiteng:TENG707298rui@cluster0.lpat5su.mongodb.net/todolistDB";
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


app.get("/", function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect("/plan");
    }
    else {
        res.render('home.ejs');
    }

});

app.route("/register")
    .get(function (req, res) {
        res.render('register.ejs', { err: "" });

    })
    .post(function (req, res) {
        let username = req.body.username;
        let password = req.body.password;

        User.register({ username: username }, password, function (err, user) {
            if (err) {
                res.render('register.ejs', { err: err.message });
            }
            else {
                passport.authenticate('local')(req, res, function () {
                    res.redirect('/login?message=' + encodeURIComponent('successfully registered.'));
                });
            }
        });
    });

app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
    function (req, res) {
        res.redirect('/plan');
    });
//passport.authenticate() is middleware which will authenticate the request. 
//By default, when authentication succeeds, the req.user property is set to the authenticated user, a login session is established, and the next function in the stack is called.
//if passport.authenticate success,  passport.authenticate() middleware calls the next function in the stack.
//otherwise the user is re-prompted to sign in , along with the failureMessage option which will add the message to req.session.messages.

app.get("/login", function (req, res) {
    let message = req.query.message;

    if (req.session.messages) {
        message = req.session.messages[0];
    }

    res.render('login.ejs', { message: message });
});


async function getPlan(username) {
    const user = await User.findOne({ username: username });
    if (user.plans.length) {
        const plans = await Plan.find({ _id: { $in: user.plans } });
        return plans; 
    }
    else {
        return undefined; 
    }
}

app.route('/plan')
    .get(async function (req, res) {
        if (req.isAuthenticated()) {
            const plans = await getPlan(req.session.passport.user);
            let [dayShort, dayDisplay] = date.getToday();
            if (plans) {
                res.render("todolist.ejs", { items: plans, dayDisplay: dayDisplay });
            }
            else {
                res.render("todolist.ejs", { items: [{ content: 'Create your first plan.', id: 0 }], dayDisplay: dayDisplay });
            }

        }
        else {
            res.render('home.ejs');
        }
    })
    .post(async function (req, res) {
        if (req.isAuthenticated()) {
        let content = req.body.newItem;
        let username = req.session.passport.user;

        const plan = new Plan({
            content: content,
        });
        plan.save().then(
            User.findOneAndUpdate({ username: username }, { $push: { plans: plan._id } }, function (err) {
                if (!err) {
                    res.redirect('/plan');
                }
            }));
        }
        else
        {
            res.render('home.ejs');
        }

    });

app.post('/delete',async function(req,res){
    let deleteId=req.body.id;
    let username = req.session.passport.user;

    const user=await User.findOne({ username: username });
    user.plans.remove(deleteId);
    user.save().then(
        Plan.findByIdAndRemove(deleteId,function(err){
            if(!err){
                res.send('successfully delete the item.');
            }
        })
    )
    // User.findOneAndUpdate({ username: username }, { $pull: { plans: mongoose.Types.ObjectId(deleteId)} });
    
});


app.listen(8000, function () {
    console.log("server started");
});
