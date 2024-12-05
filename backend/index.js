const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const axios = require("axios");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
const serviceAccount = require("./firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// API route to fetch products from Firestore
app.get("/api/products", async (req, res) => {
  try {
    // Fetch all products from Firestore
    const productsRef = db.collection("products");
    const snapshot = await productsRef.get();

    if (snapshot.empty) {
      return res.status(404).send({ error: "No products found." });
    }

    // Map Firestore documents to JSON
    const products = snapshot.docs.map((doc) => doc.data());

    res.status(200).json(products); // Send products to the frontend
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send({ error: "Error fetching products" });
  }
});

// Image proxy route
app.get("/api/image-proxy", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send({ error: "Image URL is required." });
  }

  try {
    // Fetch the image from the given URL
    const response = await axios.get(url, { responseType: "arraybuffer" });

    // Pass through the content type
    res.set("Content-Type", response.headers["content-type"]);

    // Send the image data
    res.send(response.data);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).send({ error: "Error fetching image." });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
