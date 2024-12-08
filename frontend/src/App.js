import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./Homepage";
import ProductPage from "./ProductPage";
import CategoryPage from "./CategoryPage";
import AboutPage from "./AboutPage";
import CartPage from "./CartPage";
import ProfilePage from "./ProfilePage";
import ProfileViewPage from "./ProfileViewPage";
import "./App.css";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  // If user is not logged in, redirect all routes except /profile to /profile
  // We'll create a simple component to handle that:
  const ProtectedRoute = ({ element }) => {
    return user ? element : <Navigate to="/profile" />;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* If not logged in, only /profile should be accessible */}
          <Route path="/profile" element={<ProfilePage />} />
          {/* If user logged in, they can see other routes */}
          <Route path="/" element={<ProtectedRoute element={<Homepage />} />} />
          <Route path="/product/:id" element={<ProtectedRoute element={<ProductPage />} />} />
          <Route path="/category/:category" element={<ProtectedRoute element={<CategoryPage />} />} />
          <Route path="/about" element={<ProtectedRoute element={<AboutPage />} />} />
          <Route path="/cart" element={<ProtectedRoute element={<CartPage />} />} />
          <Route path="/profile-view" element={<ProtectedRoute element={<ProfileViewPage />} />} />

          {/* Catch-all: If user tries unknown path and is not logged in, goes to profile */}
          <Route path="*" element={user ? <Homepage /> : <ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
