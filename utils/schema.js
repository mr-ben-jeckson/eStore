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
        }),
        /* Adding Permission Validator */
        addPermission: Joi.object({
            userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            permitId: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
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
    /* Categories Validation  */
    CatSchema: {
        add: Joi.object({
            name: Joi.string().required()
        }),
        addSub: Joi.object({
            name: Joi.string().required(),
            image: Joi.string(),
            catid: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            childcat: Joi.optional(),
            user: Joi.optional()
        }),
        addChild: Joi.object({
            name: Joi.string().required(),
            image: Joi.string().required(),
            subcatid: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            user: Joi.optional()
        })
    },
    /* Tag Validation */
    TagSchema: {
        addTag: Joi.object({
            name: Joi.string().required(),
            image: Joi.string().required(),
            user: Joi.optional()
        })
    },
    /* Delivery Validation */
    DeliSchema: {
        addDeli: Joi.object({
            name: Joi.string().required(),
            price: Joi.number().required(),
            image: Joi.string().required(),
            duration: Joi.string(),
            remark: Joi.optional(),
            user: Joi.optional()
        })
    },
    /* Warranty Validation */
    WarrantySchema: {
        addWarranty: Joi.object({
            name: Joi.string().required(),
            image: Joi.string().required(),
            remark: Joi.optional(),
            user: Joi.optional()
        }),
        editWarranty: Joi.object({
            name: Joi.string().required(),
            image: Joi.optional(),
            remark: Joi.optional(),
            user: Joi.optional()
        })
    },
    /* MongoDB Id Validation */
    AllSchema: {
        id: Joi.object({
            id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        })
    }
}