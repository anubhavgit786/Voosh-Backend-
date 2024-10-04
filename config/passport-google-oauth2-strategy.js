const bcrypt = require('bcryptjs');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuthentication = async (accessToken, refreshToken, profile, done) => 
{

    try 
    {
        let user = await User.findOne({ googleId: profile.id }).select("email password firstname lastname");
        
        if (!user) 
        {
            const nameParts = profile.displayName.split(' ');
            const firstname = nameParts[0];
            const lastname = nameParts.slice(1).join(' ');

            user = new User(
            {
                googleId: profile.id,
                email: profile.emails[0].value,
                firstname,
                lastname,
            });
              
            await user.save();
        }

        const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: '1h' });
        return done(null, { user, token });  // Include user and token
    } 
    catch (error) 
    {
        return done(error, false);
    }
}

const strategy = new GoogleStrategy(
{
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, userAuthentication);

passport.use(strategy);

passport.serializeUser((userData, done) => 
{
    return done(null, { id: userData.user._id, token: userData.token });  
});
    
passport.deserializeUser(async (sessionData, done) => 
{
    // Retrieve the user from the database using the stored user ID
    const user = await User.findById(sessionData.id);
    return done(null, { user, token: sessionData.token });
});

module.exports = passport;