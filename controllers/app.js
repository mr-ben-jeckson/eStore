const nodeCron = require('node-cron');
   
const jobs = nodeCron.schedule('20 21 * * *', () => {
        /* Every Day Jobs Here at 9:20 PM Asia/Yangon Time */ 
        /* Your work is here */
        console.log('Running Job At 9:20 PM at Myanmar/Yangon');
    },{
        scheduled: true,
        timezone: "Asia/Yangon" // Myanmar Time Zone
});

module.exports = {
    jobs
}