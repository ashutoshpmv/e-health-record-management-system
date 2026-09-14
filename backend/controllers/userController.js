const User = require("../models/User");


// ==========================================
// GET PROFILE
// ==========================================

const getProfile = async (req, res) => {

    try {

        const user =
            await User.findById(
                req.user.userId
            ).select("-password");

        if (!user) {

            return res.status(404).json({
                message: "User not found."
            });
        }

        res.status(200).json({
            user
        });

    } catch (error) {

        console.error(
            "Get profile error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while fetching profile."
        });
    }
};


// ==========================================
// UPDATE PROFILE
// ==========================================

const updateProfile = async (req, res) => {

    try {

        const {
            name,
            dateOfBirth,
            gender,
            phone,
            bloodGroup,
            allergies,
            emergencyContact
        } = req.body;


        const user =
            await User.findById(
                req.user.userId
            );

        if (!user) {

            return res.status(404).json({
                message: "User not found."
            });
        }


        if (name !== undefined) {
            user.name = name;
        }

        if (dateOfBirth !== undefined) {
            user.dateOfBirth = dateOfBirth;
        }

        if (gender !== undefined) {
            user.gender = gender;
        }

        if (phone !== undefined) {
            user.phone = phone;
        }

        if (bloodGroup !== undefined) {
            user.bloodGroup = bloodGroup;
        }

        if (allergies !== undefined) {
            user.allergies = allergies;
        }

        if (emergencyContact !== undefined) {
            user.emergencyContact =
                emergencyContact;
        }


        await user.save();


        const updatedUser =
            await User.findById(
                user._id
            ).select("-password");


        res.status(200).json({

            message:
                "Profile updated successfully.",

            user: updatedUser
        });

    } catch (error) {

        console.error(
            "Update profile error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while updating profile."
        });
    }
};


// ==========================================
// GET ALL PATIENTS
// DOCTOR ONLY
// ==========================================

const getPatients = async (req, res) => {

    try {

        const patients =
            await User.find({
                role: "patient"
            })
            .select(
                "name email dateOfBirth gender phone bloodGroup"
            )
            .sort({
                name: 1
            });


        res.status(200).json({
            count: patients.length,
            patients
        });

    } catch (error) {

        console.error(
            "Get patients error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while fetching patients."
        });
    }
};


module.exports = {
    getProfile,
    updateProfile,
    getPatients
};