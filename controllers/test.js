const { sendMail } = require('../utils/email');
const Helper = require('../utils/helper');

module.exports = {
    test: async(req, res, next) => {
        /* Testing feature function here */

        // value = [
        //     {
        //         "name": "Mg Mg",
        //         "phone": "+959 9782456123"
        //     },
        //     {
        //         "name": "Mg Mg",
        //         "phone": "+959 9782456123"
        //     }
        // ];
        // user = "thanhtikexaw@gmail.com";
        // sub = "Testing Email from Server";
        // sendMail(value, user, sub);

        /* Testing feature function here */

        Helper.fMsg(res, "Test Success");
    }
}