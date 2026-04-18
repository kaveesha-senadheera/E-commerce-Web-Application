// Main server configuration file

require('dotenv').config({ path: __dirname + '/.env', debug: false });


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// Configure middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing (needed for frontend/backend communication)
app.use(express.json()); // Parse incoming JSON requests (body-parser alternative)

// Database connection setup 
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.log("MongoDB connection failed:", err.message);
    process.exit(1);
  });

// API Route organization
// Route structure follows RESTful conventions:
// - /api/:resource for core data entities
// - Routes delegated to separate files for maintainability
app.use("/api/users", require("./routes/users"));  // User management endpoints
app.use("/api/orders", require("./routes/orders"));  // Order processing endpoints
app.use("/api/deliveries", require("./routes/deliveries"));  // Delivery tracking endpoints

// Server port configuration
// process.env.PORT allows deployment platforms to set port (e.g., Heroku)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
