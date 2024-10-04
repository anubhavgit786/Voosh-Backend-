const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

const userAuthentication = async (req, email, password, done) => 
{
    try 
    {
        let user = await User.findOne({ email }).select("email password firstname lastname");

        if(!user)
        {
            return done(null, false, { errors : [{ param : "username", msg : "Invalid username or password" }] });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch)
        {
            return done(null, false, { errors : [{ param : "username", msg : "Invalid username or password" }] });
        }

        const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: '1h' });
        return done(null, { user, token });  
    }
    catch(err)
    {
        return done(err, false);
    }       
}

const strategy = new LocalStrategy({ usernameField : 'email', passReqToCallback : true }, userAuthentication);


passport.use(strategy);

passport.serializeUser((userData, done) => 
{
    done(null, userData);  
});

passport.deserializeUser((userData, done) => 
{
    done(null, userData);  
});

module.exports = passport;