const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_Secret, {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    const { username, password } = req.body;
    const userExists = await User.findOne({ username });
    if(userExists) {
        return res.status(400).json({message: 'User already exists'});
    } 

    const user = await User.create({
        username,
        password,
    });

    if(user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data'});
    }
};

const authUser = async(req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({ username });
    
    if(user && (await user.matchPassword(password))) {
        res.status(200).json({
            _id: user._id,
            username: user.username,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid username or password'});
    }
};

module.exports = { registerUser, authUser };