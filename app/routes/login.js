const express = require('express');
const {User,Plan,passport}=require(__dirname+'/../models/todoDB.js');

let router = express.Router();

router.get('/', function (req, res) {
    let message = req.query.message;

    if (req.session.messages) {
        message = req.session.messages[0];
    }

    res.render('login.ejs', { message: message });
});

router.post('/', passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
function (req, res) {
    res.redirect('/plan');
});
//passport.authenticate() is middleware which will authenticate the request. 
//By default, when authentication succeeds, the req.user property is set to the authenticated user, a login session is established, and the next function in the stack is called.
//if passport.authenticate success,  passport.authenticate() middleware calls the next function in the stack.
//otherwise the user is re-prompted to sign in , along with the failureMessage option which will add the message to req.session.messages.


module.exports = router;