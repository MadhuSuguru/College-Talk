const asyncHandler = require('express-async-handler');
const generateToken = require('../config/generateToken');
const User = require('../models/userModel');
const registerUser = asyncHandler(async (req,res) => {
    var { username, email, password, college, dp } = req.body;

    if (!username || !email || !password || !college) {
        res.status(400);
        throw new Error("Invalid Credentials" );
    }
    const userExist = await User.findOne({ email });

    if (userExist) {
        res.status(400);
        throw new Error("User already Exists" );
    }
    college = college.value;

    const user = await User.create({
        username,
        password,
        college,
        email,
        dp,
    });
    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            college: user.college,
            dp: user.dp,
            token: generateToken(user._id),
        })
    }
    else {
        res.send(400);
        throw new Error( "Failed to Create Account" );
    }
});

const authUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        res.status(400);
        throw new Error("User doesn't Exist")
    }
    if (user && await user.matchPassword(password)) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            college: user.college,
            dp: user.dp,
            token: generateToken(user._id),
        })
    }
        else {
        res.status(401);
        throw new Error("Incorrect Password" )
        }
    
})

const allUsers = asyncHandler(async (req, res) => {
    const search = req.query.search;
    const searchuser = search ? {
         username: { $regex: search, $options: "i" } 
    } : {};
    const college = req.user.college;
    const user = await User.find( searchuser ).find({ college })
        .find({ _id: { $ne: req.user._id } });
    res.send(user);
})

module.exports = { registerUser, authUser, allUsers };
