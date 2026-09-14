const express = require("express");

const {
    getProfile,
    updateProfile,
    getPatients
} = require("../controllers/userController");

const protect =
    require("../middleware/authMiddleware");

const allowRoles =
    require("../middleware/roleMiddleware");

const router = express.Router();


// ==========================================
// PROFILE
// ==========================================

router.get(
    "/profile",
    protect,
    getProfile
);


router.put(
    "/profile",
    protect,
    updateProfile
);


// ==========================================
// PATIENT LIST
// DOCTOR ONLY
// ==========================================

router.get(
    "/patients",
    protect,
    allowRoles("doctor"),
    getPatients
);


module.exports = router;