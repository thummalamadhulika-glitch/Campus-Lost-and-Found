
const express = require("express");
const router = express.Router();

const Claim = require("../models/Claim");
const Item = require("../models/Item");

const { protect, adminOnly } =
    require("../middleware/authMiddleware");

// POST - Submit a claim
router.post("/", protect, async (req, res) => {
    try {
        const { itemId, description } = req.body;

        if (!itemId || !description) {
            return res.status(400).json({
                message: "Please enter all fields"
            });
        }

        const item = await Item.findById(itemId);

        if (!item) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        const newClaim = new Claim({
            item: itemId,
            student: req.user._id,
            description: description
        });

        const savedClaim = await newClaim.save();

        res.status(201).json({
            message: "Claim submitted successfully!",
            claim: savedClaim
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});


// GET - View logged-in student's claims
router.get("/myclaims", protect, async (req, res) => {
    try {
        const claims = await Claim.find({
            student: req.user._id
        })
        .populate("item")
        .populate("student", "name email");

        res.status(200).json(claims);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// GET - Admin views all claims
router.get("/", protect, adminOnly, async (req, res) => {
    try {
        const claims = await Claim.find()
            .populate("item")
            .populate("student", "name email");

        res.status(200).json(claims);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// PUT - Admin updates claim status
router.put("/:id", protect, adminOnly, async (req, res) => {
    try {
        const { status } = req.body;

        console.log("========== CLAIM DEBUG ==========");
        console.log("Database:", Claim.db.name);
        console.log("Collection:", Claim.collection.name);
        console.log("Received ID:", req.params.id);

        if (!["Pending", "Approved", "Rejected"].includes(status)) {
            return res.status(400).json({
                message: "Invalid claim status"
            });
        }

        const testClaim = await Claim.findOne({
            _id: req.params.id
        });

        console.log("MongoDB result:", testClaim);

        if (!testClaim) {
            return res.status(404).json({
                message: "Claim not found",
                database: Claim.db.name,
                collection: Claim.collection.name,
                receivedId: req.params.id
            });
        }

        const updatedClaim = await Claim.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true }
        )
        .populate("item")
        .populate("student", "name email");

        res.status(200).json({
            message: "Claim status updated successfully!",
            claim: updatedClaim
        });

    } catch (error) {
        console.log("Claim update error:", error.message);

        res.status(400).json({
            message: error.message
        });
    }
});

module.exports = router;
