const Joi = require('joi');
module.exports = {
    //User Validation
    UserSchema: {
        register: Joi.object({
            name: Joi.string().min(5).required(),
            email: Joi.string().email().required(),
            phone: Joi.string().min(7).max(11).required(),
            password: Joi.string().min(8).required()
        }),
        login: Joi.object({
            phone: Joi.string().min(7).max(11).required(),
            password: Joi.string().min(8).required()
        })
    },
    //Permission Validation
    PermitSchema: {
        add: Joi.object({
            name: Joi.string().required()
        })
    },
    //Role Validation
    RoleSchema: {
        add: Joi.object({
            name: Joi.string().required()
        }),
        addPermit: Joi.object({
            roleId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            permitId: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        })
    },
    //MongoDB Id Validation
    AllSchema: {
        id: Joi.object({
            id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        })
    }
}