const MedicalRecord = require("../models/MedicalRecord");
const User = require("../models/User");

const { encrypt, decrypt } = require("../utils/encryption");


// =====================================================
// CREATE MEDICAL RECORD
// =====================================================

const createRecord = async (req, res) => {
    try {
        const {
            patientId,
            symptoms,
            diagnosis,
            medications,
            notes,
            visitDate
        } = req.body;

        // Basic validation
        if (!patientId || !symptoms || !diagnosis) {
            return res.status(400).json({
                message:
                    "Patient, symptoms and diagnosis are required."
            });
        }

        // Check whether patient exists
        const patient = await User.findOne({
            _id: patientId,
            role: "patient"
        });

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found."
            });
        }

        // Encrypt sensitive medical information
        const encryptedSymptoms = encrypt(symptoms);
        const encryptedDiagnosis = encrypt(diagnosis);
        const encryptedMedications = encrypt(medications);
        const encryptedNotes = encrypt(notes);

        // Create record
        const record = await MedicalRecord.create({
            patient: patientId,
            doctor: req.user.userId,

            symptoms: encryptedSymptoms,
            diagnosis: encryptedDiagnosis,
            medications: encryptedMedications,
            notes: encryptedNotes,

            visitDate: visitDate || Date.now()
        });

        // Populate doctor and patient
        const populatedRecord = await MedicalRecord.findById(
            record._id
        )
            .populate("patient", "-password")
            .populate("doctor", "-password");

        // Decrypt before sending response
        const responseRecord = {
            ...populatedRecord.toObject(),

            symptoms: decrypt(populatedRecord.symptoms),
            diagnosis: decrypt(populatedRecord.diagnosis),
            medications: decrypt(populatedRecord.medications),
            notes: decrypt(populatedRecord.notes)
        };

        res.status(201).json({
            message: "Medical record created successfully.",
            record: responseRecord
        });

    } catch (error) {
        console.error("Create record error:", error);

        res.status(500).json({
            message: "Server error while creating medical record."
        });
    }
};


// =====================================================
// GET MEDICAL RECORDS
// =====================================================

const getRecords = async (req, res) => {
    try {
        let records;

        // Patient can see their own records
        if (req.user.role === "patient") {
            records = await MedicalRecord.find({
                patient: req.user.userId
            })
                .populate("patient", "-password")
                .populate("doctor", "-password")
                .sort({ visitDate: -1 });
        }

        // Doctor can see records created by them
        else if (req.user.role === "doctor") {
            records = await MedicalRecord.find({
                doctor: req.user.userId
            })
                .populate("patient", "-password")
                .populate("doctor", "-password")
                .sort({ visitDate: -1 });
        }

        // Decrypt records before returning them
        const decryptedRecords = records.map((record) => {
            const recordObject = record.toObject();

            return {
                ...recordObject,

                symptoms: decrypt(recordObject.symptoms),
                diagnosis: decrypt(recordObject.diagnosis),
                medications: decrypt(recordObject.medications),
                notes: decrypt(recordObject.notes)
            };
        });

        res.status(200).json({
            count: decryptedRecords.length,
            records: decryptedRecords
        });

    } catch (error) {
        console.error("Get records error:", error);

        res.status(500).json({
            message: "Server error while fetching medical records."
        });
    }
};


// =====================================================
// GET SINGLE MEDICAL RECORD
// =====================================================

const getRecordById = async (req, res) => {
    try {
        const record = await MedicalRecord.findById(req.params.id)
            .populate("patient", "-password")
            .populate("doctor", "-password");

        if (!record) {
            return res.status(404).json({
                message: "Medical record not found."
            });
        }

        const isPatient =
            req.user.role === "patient" &&
            record.patient._id.toString() === req.user.userId;

        const isDoctor =
            req.user.role === "doctor" &&
            record.doctor._id.toString() === req.user.userId;

        // Only authorized users can access
        if (!isPatient && !isDoctor) {
            return res.status(403).json({
                message:
                    "You are not authorized to access this record."
            });
        }

        const recordObject = record.toObject();

        const decryptedRecord = {
            ...recordObject,

            symptoms: decrypt(recordObject.symptoms),
            diagnosis: decrypt(recordObject.diagnosis),
            medications: decrypt(recordObject.medications),
            notes: decrypt(recordObject.notes)
        };

        res.status(200).json({
            record: decryptedRecord
        });

    } catch (error) {
        console.error("Get record error:", error);

        res.status(500).json({
            message: "Server error while fetching medical record."
        });
    }
};


// =====================================================
// UPDATE MEDICAL RECORD
// =====================================================

const updateRecord = async (req, res) => {
    try {
        const record = await MedicalRecord.findById(
            req.params.id
        );

        if (!record) {
            return res.status(404).json({
                message: "Medical record not found."
            });
        }

        // Only the doctor who created the record
        // can update it
        if (
            req.user.role !== "doctor" ||
            record.doctor.toString() !== req.user.userId
        ) {
            return res.status(403).json({
                message:
                    "You are not authorized to update this record."
            });
        }

        const {
            symptoms,
            diagnosis,
            medications,
            notes,
            visitDate
        } = req.body;

        // Encrypt updated values
        if (symptoms !== undefined) {
            record.symptoms = encrypt(symptoms);
        }

        if (diagnosis !== undefined) {
            record.diagnosis = encrypt(diagnosis);
        }

        if (medications !== undefined) {
            record.medications = encrypt(medications);
        }

        if (notes !== undefined) {
            record.notes = encrypt(notes);
        }

        if (visitDate !== undefined) {
            record.visitDate = visitDate;
        }

        await record.save();

        const updatedRecord =
            await MedicalRecord.findById(record._id)
                .populate("patient", "-password")
                .populate("doctor", "-password");

        const recordObject = updatedRecord.toObject();

        const decryptedRecord = {
            ...recordObject,

            symptoms: decrypt(recordObject.symptoms),
            diagnosis: decrypt(recordObject.diagnosis),
            medications: decrypt(recordObject.medications),
            notes: decrypt(recordObject.notes)
        };

        res.status(200).json({
            message: "Medical record updated successfully.",
            record: decryptedRecord
        });

    } catch (error) {
        console.error("Update record error:", error);

        res.status(500).json({
            message:
                "Server error while updating medical record."
        });
    }
};


// =====================================================
// DELETE MEDICAL RECORD
// =====================================================

const deleteRecord = async (req, res) => {
    try {
        const record = await MedicalRecord.findById(
            req.params.id
        );

        if (!record) {
            return res.status(404).json({
                message: "Medical record not found."
            });
        }

        // Only the doctor who created the record
        // can delete it
        if (
            req.user.role !== "doctor" ||
            record.doctor.toString() !== req.user.userId
        ) {
            return res.status(403).json({
                message:
                    "You are not authorized to delete this record."
            });
        }

        await MedicalRecord.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            message: "Medical record deleted successfully."
        });

    } catch (error) {
        console.error("Delete record error:", error);

        res.status(500).json({
            message:
                "Server error while deleting medical record."
        });
    }
};


module.exports = {
    createRecord,
    getRecords,
    getRecordById,
    updateRecord,
    deleteRecord
};