const Joi = require('joi');
module.exports = {
    //Permission Validation
    PermitSchema: {
        add: Joi.object({
            name: Joi.string().required()
        })
    },
    //MongoDB Id Validation
    AllSchema: {
        id: Joi.object({
            id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        })
    }
}