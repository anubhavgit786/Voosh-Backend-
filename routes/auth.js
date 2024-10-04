const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');


const userController = require('../controllers/user_controller');
const userValidator = require('../validators/user_validator')
const validation = require('../validators/validation')

const router = express.Router();


router.post('/signup', userValidator.registerValidator(), validation.validate, userController.register);
router.post('/login', userValidator.loginValidator(), validation.validate, (req, res, next) => 
{
    passport.authenticate('local', (err, userData, info) => 
    {
        if (err) 
        {
            return res.status(500).json({ message: 'An error occurred during login.' });
        }
        
        if (!userData) 
        {
            return res.status(401).json({ errors: info.errors }); // Send error message
        }
        
        req.login(userData, (err) => 
        {
            if (err) 
            {
                return res.status(500).json({ message: 'An error occurred during login.' });
            }
            
            return res.status(200).json({ message: 'Login successful!', user: userData.user, token: userData.token }); // Send user data on success
        });
        
    })(req, res, next);
});
  

router.post('/logout', userController.logout); 

// @route   GET /api/v1/auth/google
// @desc    Initiate Google OAuth flow
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


// @route   GET /api/v1/auth/google/callback
// @desc    Google OAuth callback to handle authentication and token creation
// Google Authentication Route
router.get('/google/callback', passport.authenticate("google",
{
    successRedirect:`${process.env.CLIENT_URL}/auth/google/callback`,
    failureRedirect:`${process.env.CLIENT_URL}/login`
}));

router.get("/login/success", (req,res)=>
{
    if(req.isAuthenticated()) 
    {
        const { user, token } = req.user;
        return res.status(200).json({ message: 'Login successful!', user, token });
    }

    return res.status(401).json({ errors : [{ param : "username", msg : "Invalid username or password" }] });
})

router.get('/verify-token', passport.authenticate('jwt', { session: false }), (req, res) => 
{
    res.status(200).json({ message: 'Token is valid' });
});




module.exports = router;