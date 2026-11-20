require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const itemRoutes = require("./routes/itemRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();
const claimRoutes = require("./routes/claimRoutes");
// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/claims", claimRoutes);
app.use("/api/users", userRoutes);
// Home route
app.get("/", (req, res) => {
    res.send("Campus Lost and Found Backend is Running!");
});
// Test route
app.get("/api/test", (req, res) => {
    res.json({
        message: "Backend is working successfully!"
    });
});
// Item routes
app.use("/api/items", itemRoutes);
// User routes
app.use("/api/users", userRoutes);
// Connect MongoDB
const PORT = process.env.PORT || 5001;
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully!");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection Failed:", error.message);
    });
