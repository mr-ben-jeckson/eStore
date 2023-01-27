const corn = require('node-cron');

const jobs = () => {
    /* Every Day Jobs Here at 9 AM Asia/Yangon Time */
    corn.schedule('0 9 * * *', () => {
        /* Your work is here */
        console.log('Running Job At 6:42 PM at Myanmar/Yangon');
    },{
        scheduled: true,
        timezone: "Asia/Yangon" // Myanmar Time Zone
    });
}

module.exports = {
    jobs
}