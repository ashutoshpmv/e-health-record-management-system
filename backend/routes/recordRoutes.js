const express = require("express");

const {
    createRecord,
    getRecords,
    getRecordById,
    updateRecord,
    deleteRecord
} = require("../controllers/recordController");

const protect = require("../middleware/authMiddleware");

const allowRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// ==========================================
// CREATE MEDICAL RECORD
// Doctor only
// ==========================================

router.post(
    "/",
    protect,
    allowRoles("doctor"),
    createRecord
);


// ==========================================
// GET MEDICAL RECORDS
// Patient → own records
// Doctor → own created records
// ==========================================

router.get(
    "/",
    protect,
    allowRoles("patient", "doctor"),
    getRecords
);


// ==========================================
// GET SINGLE RECORD
// ==========================================

router.get(
    "/:id",
    protect,
    allowRoles("patient", "doctor"),
    getRecordById
);


// ==========================================
// UPDATE RECORD
// Doctor only
// ==========================================

router.put(
    "/:id",
    protect,
    allowRoles("doctor"),
    updateRecord
);


// ==========================================
// DELETE RECORD
// Doctor only
// ==========================================

router.delete(
    "/:id",
    protect,
    allowRoles("doctor"),
    deleteRecord
);


module.exports = router;