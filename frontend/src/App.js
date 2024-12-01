import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Homepage";
import ProductPage from "./ProductPage";
import CategoryPage from "./CategoryPage";
import AboutPage from "./AboutPage";
import CartPage from "./CartPage"; // Import CartPage
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Define routes for your app */}
          <Route path="/" element={<Homepage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cart" element={<CartPage />} /> {/* Add this line */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
