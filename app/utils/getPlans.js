module.exports.getPlan = getPlan;

const index=require(__dirname+'/../index.js');
const User=index.User;

async function getPlan(username) {
    const plans = await User.findOne({ username: username }, { _id: 0, plans: 1 },);

}

