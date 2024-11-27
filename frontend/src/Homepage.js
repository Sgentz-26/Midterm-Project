import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import "./styles/homepage.css";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [productWidth, setProductWidth] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // State for the search input
  const navigate = useNavigate(); // React Router's hook for navigation

  useEffect(() => {
    // Fetch product data from the backend API
    fetch("http://localhost:5000/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);

        // Set the width of the product cards once they are loaded
        setTimeout(() => {
          const productCard = document.querySelector(".product-card");
          if (productCard) setProductWidth(productCard.offsetWidth);
        }, 100);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

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

  const slideCarousel = (direction) => {
    const carousel = document.querySelector("#carouselItems");
    const items = carousel.querySelectorAll(".product-card");

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
        <img src={`/images/${product.images[0]}`} alt={product.title} />
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
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term
              onKeyPress={handleKeyPress} // Handle Enter key press
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={performSearch} // Perform search on button click
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
              {products.map((product) => createProductCard(product))}
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
