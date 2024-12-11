require('dotenv').config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const axios = require("axios");
const stripe = require('stripe')('SECRET_KEY_GOES_HERE');
// console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
const serviceAccount = require("./firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

let db = admin.firestore();

// Force Firestore to use the Emulator (hardcoded connection to localhost:8080)
console.log("Forcing connection to Firestore Emulator...");
db.settings({
  host: "localhost:8080",  // Firestore emulator host
  ssl: false               // Disable SSL as it's not needed for the emulator
});

console.log("Firestore initialized:", db); // Should confirm emulator is connected

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// API route to fetch products from Firestore
app.get("/api/products", async (req, res) => {
  try {
    const productsRef = db.collection("products");
    const snapshot = await productsRef.get();

    if (snapshot.empty) {
      return res.status(404).send({ error: "No products found." });
    }

    const products = snapshot.docs.map((doc) => doc.data());
    res.status(200).json(products);
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
    const response = await axios.get(url, { responseType: "arraybuffer" });
    res.set("Content-Type", response.headers["content-type"]);
    res.send(response.data);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).send({ error: "Error fetching image." });
  }
});

// Update cart items for a user
app.put("/api/users/:userId/cart", async (req, res) => {
  try {
    const { userId } = req.params;
    const { cart } = req.body;

    if (!Array.isArray(cart)) {
      return res.status(400).send({ error: "Cart must be an array of items." });
    }

    const userRef = db.collection("users").doc(userId);
    await userRef.update({ cart });

    res.status(200).send({ message: "Cart updated successfully." });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).send({ error: "Error updating cart." });
  }
});

// Fetch user cart
app.get("/api/users/:userId/cart", async (req, res) => {
  try {
    const { userId } = req.params;

    const userRef = db.collection("users").doc(userId);
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists) {
      return res.status(404).json({ error: "User not found." });
    }

    const user = userSnapshot.data();
    res.status(200).json({ cart: user.cart || [] });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Error fetching cart." });
  }
});

// Update saved items for a user
app.put("/api/users/:userId/saved", async (req, res) => {
  try {
    const { userId } = req.params;
    const { saved } = req.body;

    if (!Array.isArray(saved)) {
      return res.status(400).send({ error: "Saved must be an array of items." });
    }

    const userRef = db.collection("users").doc(userId);
    await userRef.update({ saved });

    res.status(200).send({ message: "Saved items updated successfully." });
  } catch (error) {
    console.error("Error updating saved items:", error);
    res.status(500).send({ error: "Error updating saved items." });
  }
});

// Fetch user saved items
app.get("/api/users/:userId/saved", async (req, res) => {
  try {
    const { userId } = req.params;

    const userRef = db.collection("users").doc(userId);
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists) {
      return res.status(404).json({ error: "User not found." });
    }

    const user = userSnapshot.data();
    res.status(200).json({ saved: user.saved || [] });
  } catch (error) {
    console.error("Error fetching saved items:", error);
    res.status(500).json({ error: "Error fetching saved items." });
  }
});

// API route to handle user sign-up
app.post("/api/users/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, birthday, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "First name, last name, email, and password are required." });
    }

    const usersRef = db.collection("users");
    const existingUserSnapshot = await usersRef.where("email", "==", email).get();

    if (!existingUserSnapshot.empty) {
      return res.status(400).json({ error: "Email is already associated with an account." });
    }

    const newUser = {
      firstName,
      lastName,
      email,
      phone,
      birthday,
      password,
      cart: [],
      saved: [],
      createdAt: new Date().toISOString(),
    };

    await usersRef.add(newUser);

    res.status(201).json({ message: "Account created successfully!" });
  } catch (error) {
    console.error("Error creating user account:", error);
    res.status(500).json({ error: "Error creating account." });
  }
});

// API route to handle user login
app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ error: "Email and password are required." });
    }

    const usersRef = db.collection("users");
    const userSnapshot = await usersRef.where("email", "==", email).get();

    if (userSnapshot.empty) {
      return res.status(400).send({ error: "No account found with this email." });
    }

    const user = userSnapshot.docs[0].data();

    if (user.password !== password) {
      return res.status(400).send({ error: "Incorrect password." });
    }

    res.status(200).send({
      message: "Login successful!",
      user: {
        id: userSnapshot.docs[0].id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        birthday: user.birthday,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ error: "Error during login." });
  }
});

// API route to update user profile
app.put("/api/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    const userRef = db.collection("users").doc(userId);
    await userRef.update(updates);

    res.status(200).send({ message: "Profile updated successfully." });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send({ error: "Error updating profile." });
  }
});

// API route to delete user account
app.delete("/api/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;

    const userRef = db.collection("users").doc(userId);
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists) {
      return res.status(404).send({ error: "User not found." });
    }

    const user = userSnapshot.data();

    if (user.password !== password) {
      return res.status(400).send({ error: "Incorrect password." });
    }

    await userRef.delete();
    res.status(200).send({ message: "Account deleted successfully." });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).send({ error: "Error deleting account." });
  }
});

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body;
    console.log('Received items:', items);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      })),
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating Stripe Checkout Session:', error);
    res.status(500).send({ error: 'Unable to create checkout session' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
