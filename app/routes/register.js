const express = require('express');
const {User,Plan,passport}=require(__dirname+'/../models/todoDB.js');

let router = express.Router();

router.get('/', function (req, res) {
    res.render('register.ejs', { err: "" });

});

router.post('/', function (req, res) {
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
}

)

module.exports = router;