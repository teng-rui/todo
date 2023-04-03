
module.exports.getToday = getToday;

function getToday() {
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    let today = new Date();


    let dayDisplay = today.toLocaleDateString('en-US', options);

    var month = today.getMonth() + 1; //months from 1-12
    var day = today.getDate();
    var year = today.getFullYear();

    dayShort = year+ "/" + month + "/" + day;
    return [dayShort, dayDisplay];

}