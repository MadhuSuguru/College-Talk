const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const protectauth = asyncHandler(async (req, res,next) => {
    let token;
    const auth = req.headers.authorization;
    if (auth && auth.startsWith("Bearer")) {
        try {
            token = auth.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            res.status(400);
            throw new Error("Not Authorized");
        }
    }
    if(!token) {
        res.status(400);
        throw new Error("Not Authorized");
    }
})

module.exports = { protectauth };