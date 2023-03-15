const nodeCron = require('node-cron');
   
const jobs = nodeCron.schedule('30 20 * * *', () => {
        /* Every Day Jobs Here at 8:30 PM Asia/Yangon Time */ 
        /* Your work is here */
        console.log('Running Job At 8:30 PM at Myanmar/Yangon');
    },{
        scheduled: true,
        timezone: "Asia/Yangon" // Myanmar Time Zone
});

module.exports = {
    jobs
}