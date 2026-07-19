const express = require("express");
const router = express.Router();

// Middleware
const protect = require("../middleware/authMiddleware");

// Controllers
const {
    addService,
    getServices,
    getServiceById,
    updateService,
    deleteService
} = require("../controllers/serviceController");

// Create
router.post("/", protect, addService);

// Read
router.get("/", getServices);
router.get("/:id", getServiceById);

// Update
router.put("/:id", protect, updateService);

// Delete
router.delete("/:id", protect, deleteService);

module.exports = router;