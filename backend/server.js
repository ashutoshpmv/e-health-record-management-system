const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const recordRoutes = require("./routes/recordRoutes");

dotenv.config();

const app = express();


// ==========================================
// DATABASE
// ==========================================

connectDB();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
    cors({
        origin: "*"
    })
);

app.use(express.json());


// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/", (req, res) => {

    res.json({
        message:
            "E-Health Record Management System API is running!"
    });
});


// ==========================================
// API ROUTES
// ==========================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/users",
    userRoutes
);

app.use(
    "/api/records",
    recordRoutes
);


// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {

    res.status(404).json({
        message: "API route not found."
    });
});


// ==========================================
// ERROR HANDLER
// ==========================================

app.use((err, req, res, next) => {

    console.error(err.stack);

    res.status(500).json({
        message: "Internal server error."
    });
});


// ==========================================
// START SERVER
// ==========================================

const PORT =
    process.env.PORT || 5000;

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);