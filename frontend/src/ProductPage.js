import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/product_page.css";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isSavedForLater, setIsSavedForLater] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/profile");
      return;
    }

    fetch("http://localhost:5000/api/products")
      .then((response) => response.json())
      .then((data) => {
        const foundProduct = data.find((p) => p.id === parseInt(id, 10));
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          console.error("Product not found");
        }
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, [id, user, navigate]);

  const fetchUserCart = async () => {
    const res = await fetch(`http://localhost:5000/api/users/${user.id}/cart`);
    if (!res.ok) throw new Error("Failed to fetch user cart");
    const data = await res.json();
    return data.cart || [];
  };

  const saveCartToBackend = async (updatedCart) => {
    await fetch(`http://localhost:5000/api/users/${user.id}/cart`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart: updatedCart }),
    });
  };

  const fetchUserSaved = async () => {
    const res = await fetch(`http://localhost:5000/api/users/${user.id}/saved`);
    if (!res.ok) throw new Error("Failed to fetch user saved items");
    const data = await res.json();
    return data.saved || [];
  };

  const saveSavedToBackend = async (updatedSaved) => {
    await fetch(`http://localhost:5000/api/users/${user.id}/saved`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ saved: updatedSaved }),
    });
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      const currentCart = await fetchUserCart();
      const numericPrice = parseFloat(product.price.replace("$", ""));

      const existingProduct = currentCart.find((item) => item.id === product.id);
      let updatedCart;

      if (existingProduct) {
        updatedCart = currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCart = [
          ...currentCart,
          {
            id: product.id,
            title: product.title,
            price: numericPrice,
            quantity: 1,
          },
        ];
      }

      await saveCartToBackend(updatedCart);

      setIsAddedToCart(true);
      setTimeout(() => {
        setIsAddedToCart(false);
      }, 750);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Error adding to cart. Please try again.");
    }
  };

  const handleSaveForLater = async () => {
    if (!product) return;

    try {
      const currentSaved = await fetchUserSaved();
      const numericPrice = parseFloat(product.price.replace("$", ""));

      // Check if item already saved
      const existingItem = currentSaved.find((item) => item.id === product.id);
      if (existingItem) {
        alert("This item is already in your saved for later list.");
        return;
      }

      const updatedSaved = [
        ...currentSaved,
        {
          id: product.id,
          title: product.title,
          price: numericPrice,
          quantity: 1,
        },
      ];

      await saveSavedToBackend(updatedSaved);

      // Show success animation on the "Save for Later" button
      setIsSavedForLater(true);
      setTimeout(() => {
        setIsSavedForLater(false);
      }, 750);
    } catch (error) {
      console.error("Error saving for later:", error);
      alert("Error saving item for later. Please try again.");
    }
  };

  const handleNextImage = () => {
    if (!product) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    if (!product) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const [searchTerm, setSearchTerm] = useState("");
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
              src={`http://localhost:5000/api/image-proxy?url=${encodeURIComponent(product.images[currentIndex])}`}
              alt={product.title}
            />
            <div className="thumbnail-container">
              {product.images &&
                product.images.map((imgSrc, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000/api/image-proxy?url=${encodeURIComponent(imgSrc)}`}
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
              <button
                className={`save-later-btn ${isSavedForLater ? "success" : ""}`}
                onClick={handleSaveForLater}
                disabled={isSavedForLater}
              >
                {isSavedForLater ? "Added to Saved" : "Save for Later"}
              </button>
              <button
                className={`add-to-cart-btn ${isAddedToCart ? "success" : ""}`}
                onClick={handleAddToCart}
                disabled={isAddedToCart}
              >
                {isAddedToCart ? "Added to Cart" : "Add to Cart"}
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
