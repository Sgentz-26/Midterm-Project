import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/about.css";

const AboutPage = () => {
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const navigate = useNavigate(); // Hook for navigation

  const performSearch = () => {
    const trimmedSearchTerm = searchTerm.toLowerCase().trim();

    if (!trimmedSearchTerm) {
      alert("Please enter a search term.");
      return;
    }

    // Fetch all products and filter by search term
    fetch("http://localhost:5000/api/products")
      .then((response) => response.json())
      .then((products) => {
        const filteredProducts = products.filter((product) => {
          const titleMatch = product.title.toLowerCase().includes(trimmedSearchTerm);
          const tagMatch =
            product.tags &&
            product.tags.some((tag) => tag.toLowerCase().includes(trimmedSearchTerm));

          return titleMatch || tagMatch;
        });

        if (filteredProducts.length > 0) {
          // Always overwrite sessionStorage with new results
          sessionStorage.setItem("filteredProducts", JSON.stringify(filteredProducts));
          navigate("/category/search-results"); // Navigate to the search results
        } else {
          alert("No products found for your search.");
        }
      })
      .catch((error) => console.error("Error performing search:", error));
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      performSearch();
    }
  };

  return (
    <div className="about-page">
      {/* Header */}
      <header className="p-3 text-center">
        <div className="container">
          <div className="d-flex justify-content-end">
            <Link to="/profile" className="btn btn-outline-secondary me-2">👤</Link>
            <Link to="/cart" className="btn btn-outline-secondary">🛒</Link>
          </div>
          <div className="d-flex justify-content-center align-items-center mb-2 flex-wrap">
            <div className="d-flex me-3">
              <Link to="/category/Appliances" className="btn btn-outline-secondary me-2">Appliances</Link>
              <Link to="/category/Kitchenware" className="btn btn-outline-secondary">Kitchenware</Link>
            </div>
            <h1 className="logo mx-3">
              <Link to="/">SwiftCart</Link>
            </h1>
            <div className="d-flex ms-3">
              <Link to="/category/Footwear" className="btn btn-outline-secondary me-2">Shoes</Link>
              <Link to="/category/Clothing" className="btn btn-outline-secondary">Clothing</Link>
            </div>
          </div>
          <div className="input-group mb-3 w-50 mx-auto">
            <input
              type="text"
              className="form-control"
              id="searchInput"
              placeholder="Type to Search..."
              value={searchTerm} // Bind input to searchTerm
              onChange={(e) => setSearchTerm(e.target.value)} // Update state
              onKeyDown={handleKeyPress} // Trigger search on Enter
            />
            <button
              className="btn btn-outline-secondary"
              id="searchButton"
              type="button"
              onClick={performSearch} // Trigger search on button click
            >
              🔍
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <h1>About Us</h1>
        <div className="about-section">
          <div className="about-details">
            <p>
              <strong>Course Name:</strong> SE 3190
            </p>
            <p>
              <strong>Student Names:</strong> Tirmidi Mohamed & Samuel Gentz
            </p>
            <p>
              <strong>Emails:</strong> Tmohamed@iastate.edu & sgentz@iastate.edu
            </p>
            <p>
              <strong>Date:</strong> October 20, 2024
            </p>
            <p>
              <strong>Professor's Name:</strong> Abraham Aldaco, Ph.D
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-5">
        <div className="container">
          <p className="mb-1">
            <strong>Author:</strong> Tirmidi and Samuel
            <br />
            <strong>Date:</strong> 10/20/2024
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
