const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const User = require('../models/user');

const customExtractor = (req) => 
{
    return req.header('x-auth-token') || null;
};

const userAuthentication = async (jwtPayLoad, done)=>
{
    try 
    {
        const user = await User.findById(jwtPayLoad.id);
        
        if(!user)
        {
            return done(null, false, { error: 'No token, authorization denied' });
        }

        return done(null, user);

    } 
    catch (err) 
    {
        return done(err, false);
    }
    
}

const strategy = new JWTStrategy({ jwtFromRequest : customExtractor, secretOrKey : process.env.TOKEN_SECRET_KEY }, userAuthentication)

passport.use(strategy);



module.exports = passport;