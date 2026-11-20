const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { protect } = require("../middleware/authMiddleware");
// POST - Register a new user
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check whether all fields are entered
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please enter all fields"
            });
        }
        // Check whether email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({
            message: "User registered successfully!"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
const jwt = require("jsonwebtoken");
// POST - Login user
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check whether fields are entered
        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter email and password"
            });
        }
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }
        // Generate JWT token
        const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
);
        res.status(200).json({
            message: "Login successful!",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
// GET - Check logged-in user
router.get("/profile", protect, async (req, res) => {
    res.status(200).json({
        message: "Welcome! You are logged in.",
        user: req.user
    });
});
module.exports = router;
