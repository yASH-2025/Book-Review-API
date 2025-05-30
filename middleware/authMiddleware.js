const jwt = require('jsonwebtoken');
const user = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try{
            token = req.headers.authorization.split(' ')[1];
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findByID(decoded.id).select('-password');
            next();
        }
        catch (error) {
            console.log(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } 

    if(!token){
        res.status(401).json({message: 'Not authorized, no token' });
    }
};

module.exports = {protect};