const express = require("express");

const {
    assessHealth
} = require("../controllers/aiController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/assessment",
    protect,
    assessHealth
);

module.exports = router;