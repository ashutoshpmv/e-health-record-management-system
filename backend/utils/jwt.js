const jwt = require("jsonwebtoken");

// Create JWT token
const generateToken = (userId, role) => {
    return jwt.sign(
        {
            userId: userId,
            role: role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};


// Verify JWT token
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};


module.exports = {
    generateToken,
    verifyToken
};