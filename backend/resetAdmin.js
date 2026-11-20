
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function resetAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected!");

        // Choose your own new password
        const newPassword = "admin123";

        // Encrypt the password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Find and update admin account
        const user = await User.findOneAndUpdate(
            { email: "admin1@example.com" },
            { password: hashedPassword },
            { new: true }
        );

        // Display account details (not the password)
        if (!user) {
            console.log("Admin account not found!");
        } else {
            console.log("Admin password reset successfully!");
            console.log("Updated email:", user.email);
            console.log("Updated role:", user.role);
        }

    } catch (error) {
        console.log("Error:", error.message);

    } finally {
        await mongoose.disconnect();
        console.log("MongoDB disconnected!");
    }
}

resetAdmin();
