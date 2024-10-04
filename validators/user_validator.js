const { body } = require('express-validator');
const User = require('../models/user')


module.exports.registerValidator = () => 
{
    return [
        body('email', 'Your email is not valid').not().isEmpty().isEmail().custom(value => {
          return User.findOne({ email: value }).then(user => {
            if (user) {
              return Promise.reject('Email already used')
            }
          })
        }),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
        body('confirmPassword').isLength({ min: 8 }).withMessage('Confirm Password must be at least 8 characters').custom((value, {req}) => value === req.body.password).withMessage("The passwords do not match"),
        body('firstname', 'First Name is required').not().isEmpty(),
        body('lastname', 'Last Name is required').not().isEmpty(),
    ]
}
    
module.exports.loginValidator = () => 
{
    return [
        body('email', 'Your email is not valid').not().isEmpty().isEmail(),
        body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    ]
}

