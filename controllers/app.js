const nodeCron = require('node-cron');
   
const jobs = nodeCron.schedule('0 */3 * * * *', () => {
        /* Every Day Jobs Here at 7 PM Asia/Yangon Time */ 
        /* Your work is here */
        console.log('Running Job At 7 PM at Myanmar/Yangon');
    },{
        scheduled: true,
        timezone: "Asia/Yangon" // Myanmar Time Zone
});

module.exports = {
    jobs
}