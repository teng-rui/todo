const express = require('express');


let router = express.Router();

router.get('/', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect("/plan");
    }
    else {
        res.render('home.ejs');
    }

});

module.exports = router;