const jwt = require('jsonwebtoken');
const redis = require('./redis');
module.exports = {
    /* Validation for Request Body */
    validateBody: (schema) => {
        return (req, res, next) => {
            let result = schema.validate(req.body);
            if (result.error) {
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
    /* Authorization for Role */
    validateRole: (role) => {
        return async (req, res, next) => {
            let roleCheck = req.user.roles.find(ro => ro.name == role);
            if (roleCheck) {
                next();
            } else {
                next(new Error("No permission - You don't have this role to do"));
            }
        }
    }
}