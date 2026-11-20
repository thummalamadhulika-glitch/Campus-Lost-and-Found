
const express = require("express");
const router = express.Router();

const Item = require("../models/Item");
const { protect } = require("../middleware/authMiddleware");

const multer = require("multer");
const path = require("path");

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Allow image files only
const fileFilter = function(req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

// 1. GET - Display all items
router.get("/", async (req, res) => {
    try {
        const items = await Item.find()
            .populate("reportedBy", "name email");

        res.status(200).json(items);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 2. POST - Add a new item with image
router.post("/", protect, upload.single("image"), async (req, res) => {
    try {
        const {
            type,
            itemName,
            category,
            description,
            location,
            date
        } = req.body;

        const image = req.file
            ? "/uploads/" + req.file.filename
            : "";

        const newItem = new Item({
            type,
            itemName,
            category,
            description,
            location,
            date,
            image,
            reportedBy: req.user._id
        });

        const savedItem = await newItem.save();

        res.status(201).json({
            message: "Item added successfully!",
            item: savedItem
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// 3. GET - Search and filter items
router.get("/search", async (req, res) => {
    try {
        const { keyword, category, location, type } = req.query;

        let filter = {};

        if (keyword) {
            filter.itemName = {
                $regex: keyword,
                $options: "i"
            };
        }

        if (category) {
            filter.category = category;
        }

        if (location) {
            filter.location = {
                $regex: location,
                $options: "i"
            };
        }

        if (type) {
            filter.type = type;
        }

        const items = await Item.find(filter);

        res.status(200).json(items);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 4. GET - Display logged-in student's items
router.get("/myitems", protect, async (req, res) => {
    try {
        const items = await Item.find({
            reportedBy: req.user._id
        });

        res.status(200).json(items);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// 5. GET - Display one item by ID
router.get("/:id", async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        res.status(200).json(item);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// 6. PUT - Update an item by ID
router.put("/:id", async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedItem) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        res.status(200).json({
            message: "Item updated successfully!",
            item: updatedItem
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// 7. DELETE - Delete an item by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(
            req.params.id
        );

        if (!deletedItem) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        res.status(200).json({
            message: "Item deleted successfully!"
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

module.exports = router;
