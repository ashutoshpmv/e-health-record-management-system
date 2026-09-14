const User = require("../models/User");
const bcrypt = require("bcryptjs");

const { generateToken } = require("../utils/jwt");


// ==========================================
// REGISTER USER
// ==========================================

const registerUser = async (req, res) => {
    try {

        const {
            name,
            email,
            password,
            role
        } = req.body;


        // -----------------------------
        // Validate input
        // -----------------------------

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required."
            });
        }


        // -----------------------------
        // Validate password length
        // -----------------------------

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long."
            });
        }


        // -----------------------------
        // Validate role
        // -----------------------------

        const userRole = role || "patient";

        if (!["patient", "doctor"].includes(userRole)) {
            return res.status(400).json({
                message: "Role must be either patient or doctor."
            });
        }


        // -----------------------------
        // Check existing user
        // -----------------------------

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });


        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email."
            });
        }


        // -----------------------------
        // Hash password
        // -----------------------------

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        // -----------------------------
        // Create user
        // -----------------------------

        const user = await User.create({
            name: name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: userRole
        });


        // -----------------------------
        // Generate token
        // -----------------------------

        const token = generateToken(
            user._id,
            user.role
        );


        // -----------------------------
        // Response
        // -----------------------------

        res.status(201).json({

            message: "User registered successfully.",

            token: token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }

        });


    } catch (error) {

        console.error(
            "Registration error:",
            error.message
        );

        res.status(500).json({
            message: "Server error during registration."
        });
    }
};



// ==========================================
// LOGIN USER
// ==========================================

const loginUser = async (req, res) => {
    try {

        const {
            email,
            password
        } = req.body;


        // -----------------------------
        // Validate input
        // -----------------------------

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }


        // -----------------------------
        // Find user
        // -----------------------------

        const user = await User.findOne({
            email: email.toLowerCase()
        });


        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }


        // -----------------------------
        // Compare password
        // -----------------------------

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );


        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }


        // -----------------------------
        // Generate JWT
        // -----------------------------

        const token = generateToken(
            user._id,
            user.role
        );


        // -----------------------------
        // Response
        // -----------------------------

        res.status(200).json({

            message: "Login successful.",

            token: token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }

        });


    } catch (error) {

        console.error(
            "Login error:",
            error.message
        );

        res.status(500).json({
            message: "Server error during login."
        });
    }
};



module.exports = {
    registerUser,
    loginUser
};