const User = require('../models/user');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res)=>
{
    try 
    {
        const { email, password, firstname, lastname } = req.body;
        const user = User({ email, password, firstname, lastname });
        await user.save();

        const token = jsonwebtoken.sign({ id: user._id}, process.env.TOKEN_SECRET_KEY, { expiresIn : '1h'});

        return res.status(201).json({ user, token });

    } 
    catch (error) 
    {
        return res.status(500).json({ error });
    }
}



module.exports.logout = (req, res) => 
{
    req.logout((err) => 
    {
        if (err) 
        {
            return res.status(500).json({ message: 'Logout failed', error: err });
        }
        return res.status(200).json({ message: 'Logged out successfully' });
    });
};

