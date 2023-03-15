const corn = require('node-cron');

const jobs = () => {
    /* Every Day Jobs Here at 7 PM Asia/Yangon Time */
    corn.schedule('0 19 * * *', () => {
        /* Your work is here */
        console.log('Running Job At 7 PM at Myanmar/Yangon');
    },{
        scheduled: true,
        timezone: "Asia/Yangon" // Myanmar Time Zone
    });
}

module.exports = {
    jobs
}