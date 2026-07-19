const express = require("express");
const dotenv = require("dotenv");
// const connectDB = require("./config/db");

const errorHandler = require("./middleware/errorMiddleware");

dotenv.config();

// Connect to MongoDB (Enable when MongoDB is ready)
// connectDB();

const app = express();

// Middleware
app.use(express.json());

// Routes
const userRoutes = require("./routes/userRoutes");
const serviceRoutes = require("./routes/serviceRoutes");

app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);

// Home Route
app.get("/", (req, res) => {
    res.send("🚀 Local Service Finder Backend Running");
});

// 404 Route Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    });
});

// Global Error Handler
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});