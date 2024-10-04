const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => 
{
    try 
    {
        const token = req.header('x-auth-token');

    
        
        if (!token) 
        {
            return res.status(401).json({ error: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        
        req.user = decoded;
        next();
    } 
    catch (error) 
    {
        res.status(401).json({ error: 'Token is not valid' });
    }
};
