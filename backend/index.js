const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static images from the backend data folder
app.use("/images", express.static(path.join(__dirname, "data/images")));

// API route to serve data.json
app.get("/api/products", (req, res) => {
  res.sendFile(path.join(__dirname, "data/data.json"));
});

// Serve the frontend build files (optional for production)
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Default route for serving the React app (optional for production)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
