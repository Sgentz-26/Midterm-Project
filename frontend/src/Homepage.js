import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import "./styles/homepage.css";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [productWidth, setProductWidth] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch product data from the backend API
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text || "Failed to fetch products");
          });
        }
        return response.json();
      })
      .then((data) => {
        // Ensure data is an array
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Expected an array of products, got:", data);
          setProducts([]);
        }

        // Set the width of the product cards after they load
        setTimeout(() => {
          const productCard = document.querySelector(".product-card");
          if (productCard) setProductWidth(productCard.offsetWidth);
        }, 100);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        // Set products to empty to avoid map error
        setProducts([]);
      });
  }, []);

  const performSearch = () => {
    const trimmedSearchTerm = searchTerm.toLowerCase().trim();

    if (!trimmedSearchTerm) {
      alert("Please enter a search term.");
      return;
    }

    navigate(`/category/search-results?search=${encodeURIComponent(trimmedSearchTerm)}`);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      performSearch();
    }
  };

  const slideCarousel = (direction) => {
    const carousel = document.querySelector("#carouselItems");
    const items = carousel.querySelectorAll(".product-card");

    if (items.length === 0) return;

    if (direction === "next") {
      const firstItem = items[0];
      carousel.style.transition = "transform 0.5s ease";
      carousel.style.transform = `translateX(-${productWidth + 20}px)`;

      setTimeout(() => {
        carousel.style.transition = "none";
        carousel.appendChild(firstItem);
        carousel.style.transform = "translateX(0)";
      }, 500);
    } else if (direction === "prev") {
      const lastItem = items[items.length - 1];
      carousel.style.transition = "none";
      carousel.style.transform = `translateX(-${productWidth + 20}px)`;
      carousel.insertBefore(lastItem, items[0]);

      setTimeout(() => {
        carousel.style.transition = "transform 0.5s ease";
        carousel.style.transform = "translateX(0)";
      }, 50);
    }
  };

  const createProductCard = (product) => (
    <div className="product-card" style={{ cursor: "pointer" }} key={product.id}>
      <Link
        to={`/product/${product.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <img src={`/api/image-proxy?url=${encodeURIComponent(product.images[0])}`} alt={product.title} />
        <h5>{product.title}</h5>
        <p>
          <strong>{product.price}</strong>
        </p>
        <p>Rating: {product.rating} ⭐</p>
      </Link>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <header className="p-3 text-center">
        <div className="container">
          <div className="d-flex justify-content-end">
            <Link to="/profile" className="btn btn-outline-secondary me-2">
              👤
            </Link>
            <Link to="/cart" className="btn btn-outline-secondary">🛒</Link>
          </div>
          <div className="d-flex justify-content-center align-items-center mb-2 flex-wrap">
            <div className="d-flex me-3">
              <Link
                to="/category/Appliances"
                className="btn btn-outline-secondary me-2"
              >
                Appliances
              </Link>
              <Link
                to="/category/Kitchenware"
                className="btn btn-outline-secondary"
              >
                Kitchenware
              </Link>
            </div>
            <h1 className="logo mx-3">SwiftCart</h1>
            <div className="d-flex ms-3">
              <Link
                to="/category/Footwear"
                className="btn btn-outline-secondary me-2"
              >
                Shoes
              </Link>
              <Link
                to="/category/Clothing"
                className="btn btn-outline-secondary"
              >
                Clothing
              </Link>
            </div>
          </div>
          <div className="input-group mb-3 w-50 mx-auto">
            <input
              type="text"
              className="form-control"
              placeholder="Type to Search..."
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={performSearch}
            >
              🔍
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main>
        <h1 className="featured-products">Featured Products</h1>
        <div className="carousel-container">
          <button
            className="carousel-prev"
            onClick={() => slideCarousel("prev")}
          >
            &#10094;
          </button>
          <div className="carousel-wrapper">
            <div className="carousel" id="carouselItems">
              {Array.isArray(products) && products.length > 0 ? (
                products.map((product) => createProductCard(product))
              ) : (
                <p>No products available.</p>
              )}
            </div>
          </div>
          <button
            className="carousel-next"
            onClick={() => slideCarousel("next")}
          >
            &#10095;
          </button>
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
          <h2 className="about">
            <Link to="/about">About</Link>
          </h2>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
