


const express = require('express');
const {User,Plan,passport}=require(__dirname+'/../models/todoDB.js');

let router = express.Router();

router.post('/',async function(req,res){
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
    
})

module.exports = router;

