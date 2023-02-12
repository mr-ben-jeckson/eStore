const Joi = require('joi')
    .extend(require('@joi/date'));
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
            email: Joi.string().email(),
            phone: Joi.string().min(7).max(11),
            password: Joi.string().min(8).required()
        }).xor('email', 'phone'),
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
            name: Joi.string().required(),
            image: Joi.string().required()
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
    /* Product Validation */
    ProductSchema: {
        addProduct: Joi.object({
            name: Joi.string().required(),
            price: Joi.number().required(),
            title: Joi.string().required(),
            brand: Joi.string().required(),
            cat: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            subcat: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            childcat: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            tag: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            discount: Joi.number().min(0).optional(),
            features: Joi.array().required(),
            content: Joi.string().required(),
            detail: Joi.string().required(),
            status: Joi.number().min(0).less(2).required(),
            colors: Joi.array().items(Joi.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)).required(),
            sizes: Joi.array().required(),
            rating: Joi.number().min(0).less(6).optional(),
            delivery: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
            warranty: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
            images: Joi.array().required(),
            user: Joi.optional()
        }),
        editProduct: Joi.object({
            name: Joi.string().required(),
            price: Joi.number().required(),
            title: Joi.string().required(),
            brand: Joi.string().required(),
            cat: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            subcat: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            childcat: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            tag: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            discount: Joi.number().min(0).optional(),
            features: Joi.array().required(),
            content: Joi.string().required(),
            detail: Joi.string().required(),
            status: Joi.number().valid(0, 1).required(),
            colors: Joi.array().items(Joi.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)).required(),
            sizes: Joi.array().required(),
            rating: Joi.number().min(0).less(6).optional(),
            delivery: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
            warranty: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
            images: Joi.array().optional(),
            user: Joi.optional()
        }),
        searchProduct: Joi.object({
            keywords: Joi.string(),
            min: Joi.number().less(Joi.ref('max')),
            max: Joi.number().min(1),
            cat: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            subcat: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            childcat: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            tag: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            rating: Joi.number().min(0),
            color: Joi.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
            page: Joi.number().min(1),
            limit: Joi.number().min(1),
            sorts: Joi.string().regex(/^\S+$/),
            startDate: Joi.date().format(['YYYY/MM/DD', 'DD-MMM-YYYY']).less(Joi.ref('endDate')),
            endDate: Joi.date().format(['YYYY/MM/DD', 'DD-MMM-YYYY']),
        }).with('endDate', 'startDate').with('max', 'min')
    },
    /* Order Validation */
    OrderSchema: {
        addOrder: Joi.object({
            items: Joi.array().items(Joi.object({
                id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
                quantity: Joi.number().min(1),
                size: Joi.string(),
                color: Joi.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
            })).required(),
            address_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            pay_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        })
    },
    /* Shipping Address Schema */
    AddressSchema: {
        addAddress: Joi.object({
            name: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            country: Joi.string().required(),
            location: Joi.string().required(),
            address: Joi.string().required(),
            default: Joi.number().valid(0, 1),
            user: Joi.optional()
        })
    },
    /* Payment Options Schema */
    PaySchema: {
        addPay: Joi.object({
            name: Joi.string().required(),
            account: Joi.string().required(),
            number: Joi.string().required(),
            type: Joi.string().valid("MM", "MB").required(),
        })
    },
    /* Coupon Schema */
    CouponScheam: {
        addCoupon: Joi.object({
            name: Joi.string().required(),
            code: Joi.string().regex(/^\S+$/).max(10).required(),
            allow: Joi.number().greater(0).required(),
            type: Joi.string().valid("cashback", "percentage").required(),
            about: Joi.string().required(),
            status: Joi.number().valid(0, 1).required(),
            discount: Joi.number().greater(0).required(),
            expired: Joi.date().format(['YYYY/MM/DD', 'DD-MMM-YYYY']).required()
        }),
        searchCoupon: Joi.object({
            keywords: Joi.string(),
            type: Joi.string().valid("cashback", "percentage"),
            page: Joi.number().greater(0),
            limit: Joi.number().greater(0),
            sorts: Joi.string().regex(/^\S+$/),
            startDate: Joi.date().format(['YYYY/MM/DD', 'DD-MMM-YYYY']).less(Joi.ref('endDate')),
            endDate: Joi.date().format(['YYYY/MM/DD', 'DD-MMM-YYYY']),
            expired: Joi.number().valid(0, 1)
        }).with('endDate', 'startDate'),
        activateCoupon: Joi.object({
            code: Joi.string().regex(/^\S+$/).max(10).required(),
        })
    },
    /* MongoDB Id Validation */
    AllSchema: {
        id: Joi.object({
            id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        })
    }
}