import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/product_page.css";

const ProductPage = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || []);
  const [searchTerm, setSearchTerm] = useState(""); // State for the search input
  const navigate = useNavigate(); // React Router's hook for navigation

  useEffect(() => {
    // Fetch the product data from the backend API
    fetch("http://localhost:5000/api/products")
      .then((response) => response.json())
      .then((data) => {
        const foundProduct = data.find((p) => p.id === parseInt(id));
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          console.error("Product not found");
        }
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, [id]);

  const handleAddToCart = () => {
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
      });
    }

    setCart([...cart]);
    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`${product.title} added to cart!`);
  };

  const handleSaveForLater = () => {
    alert("This feature is not yet available.");
  };

  const handleNextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

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

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
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
        <div className="product-container">
          {/* Product Image Section */}
          <div className="product-image-section">
            {product.images && product.images.length > 1 && (
              <>
                <button className="carousel-prev" onClick={handlePrevImage}>
                  &#10094;
                </button>
                <button className="carousel-next" onClick={handleNextImage}>
                  &#10095;
                </button>
              </>
            )}
            <img
              id="product-image"
              src={product.images ? `/images/${product.images[currentIndex]}` : `/images/${product.image}`}
              alt={product.title}
            />
            <div className="thumbnail-container">
              {product.images &&
                product.images.map((imgSrc, index) => (
                  <img
                    key={index}
                    src={`/images/${imgSrc}`}
                    className={`thumbnail ${index === currentIndex ? "active" : ""}`}
                    alt={`Thumbnail ${index}`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="product-info">
            <h1>{product.title}</h1>
            <h2>{product.manufacturer || "Unknown Manufacturer"}</h2>
            <div className="product-rating">
              {"⭐".repeat(Math.floor(product.rating))}
            </div>
            <div className="product-price">{product.price}</div>
            <p>{product.description}</p>

            <div className="button-container">
              <button className="btn btn-outline-secondary save-later-btn" onClick={handleSaveForLater}>
                Save for Later
              </button>
              <button className="btn btn-outline-secondary add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-5">
        <div className="container">
          <p className="mb-1">
            <strong>Author:</strong> Tirmidi and Samuel<br />
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

export default ProductPage;
