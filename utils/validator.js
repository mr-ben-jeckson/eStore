const jwt = require('jsonwebtoken');
const redis = require('./redis');
const { deleteFile } = require('./upload');
module.exports = {
    /* Validation for Request Body */
    validateBody: (schema) => {
        return (req, res, next) => {
            let result = schema.validate(req.body);
            if (result.error) {
                if(req.body.image) {
                    deleteFile(req.body.image);   
                }
                if(req.body.images) {
                    req.body.images.forEach(async(img) => {
                        deleteFile(img);
                    });
                }
                next(new Error(result.error.details[0].message));
            } else {
                next();
            }
        }
    },
    /* Validation for Request Param */
    validateParam: (schema, name) => {
        return (req, res, next) => {
            let obj = {};
            obj[`${name}`] = req.params[`${name}`];
            let result = schema.validate(obj);
            if (result.error) {
                next(new Error(result.error.details[0].message));
            } else {
                next();
            }
        }
    },
    /* Tokenization and Assign Req from Redis */
    validateToken: () => {
        return async (req, res, next) => {
            if (req.headers.authorization) {
                let token = req.headers.authorization.split(" ")[1];
                jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
                    if (err) {
                        next(new Error(`Tokeinzation Error : ${err.message}`));
                    } else {
                        let user = await redis.get(decoded._id);
                        if (user) {
                            req.user = user;
                            next();
                        } else {
                            next(new Error("Tokenization Error: User"));
                        }
                    }
                });
            } else {
                next(new Error("Tokenization Error: Header"))
            }
        }
    },
    /* Authorization for one Role */
    validateRole: (role) => {
        return async (req, res, next) => {
            let roleCheck = req.user.roles.find(ro => ro.name == role);
            if (roleCheck) {
                next();
            } else {
                next(new Error("No permission - You don't have this role to do"));
            }
        }
    },
    /* Authorization for multiple roles && Role must Array ["Super Admin", "Manager", "Admin"]*/
    hasRole: (roles) => {
        return async (req, res, next) => {
            let check = false;
            for (i = 0; i < req.user.roles.length; i++) {
                let hasRole = req.user.roles.find(ro => ro.name === roles[i]);
                if (hasRole) {
                    check = true;
                    break;
                }
            }
            if (check) next();
            else next(new Error("No permission - You don't have any role to access"));
        }
    },
    /* Authorization for multiple permission && Permission must Array ["CREATE_PRODUCTS", "DELETE_PRODUCTS"]*/
    hasPermit: (permissions) => {
        return async (req, res, next) => {
            let check = false;
            for (i = 0; i < req.user.permissions.length; i++) {
                let hasPermit = req.user.permissions.find(pm => pm.name === permissions[i]);
                if (hasPermit) {
                    check = true;
                    break;
                }
            }
            if (check) next();
            else next(new Error("No Permission - You don't has any permission to access"));
        }
    }
}