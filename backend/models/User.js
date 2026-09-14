const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        // ==========================
        // BASIC USER INFORMATION
        // ==========================

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["patient", "doctor"],
            default: "patient"
        },


        // ==========================
        // PROFILE INFORMATION
        // ==========================

        dateOfBirth: {
            type: Date
        },

        gender: {
            type: String,
            enum: ["male", "female", "other"]
        },

        phone: {
            type: String,
            trim: true
        },

        bloodGroup: {
            type: String,
            enum: [
                "A+",
                "A-",
                "B+",
                "B-",
                "AB+",
                "AB-",
                "O+",
                "O-"
            ]
        },

        allergies: {
            type: String,
            trim: true
        },

        emergencyContact: {
            name: {
                type: String,
                trim: true
            },

            phone: {
                type: String,
                trim: true
            },

            relationship: {
                type: String,
                trim: true
            }
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);