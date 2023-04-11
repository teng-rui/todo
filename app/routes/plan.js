const express = require('express');
const {User,Plan,passport}=require(__dirname+'/../models/todoDB.js');
const date=require(__dirname+'/../utils/date.js');

let router = express.Router();

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

router.get('/', async function (req, res) {
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
});

router.post('/',async function (req, res) {
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

})

module.exports = router;