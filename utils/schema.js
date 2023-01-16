const Joi = require('joi');
module.exports = {
    /* User Validation */
    UserSchema: {
        /* Registration Validator */
        register: Joi.object({
            name: Joi.string().min(5).required(),
            email: Joi.string().email().required(),
            phone: Joi.string().min(7).max(11).required(),
            password: Joi.string().min(8).required()
        }),
        /* Login Validator */
        login: Joi.object({
            phone: Joi.string().min(7).max(11).required(),
            password: Joi.string().min(8).required()
        }),
        /* Adding Role Validator */
        addRole: Joi.object({
            userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            roleId: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        })
    },
    /* Permission Validation */
    PermitSchema: {
        add: Joi.object({
            name: Joi.string().required()
        })
    },
    /* Role Validation */
    RoleSchema: {
        /* Adding New Role Validator */
        add: Joi.object({
            name: Joi.string().required()
        }),
        /* Adding permission to role Validator */
        addPermit: Joi.object({
            roleId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            permitId: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        })
    },
    /* MongoDB Id Validation */
    AllSchema: {
        id: Joi.object({
            id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        })
    }
}