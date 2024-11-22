import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/homepage.css";

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [productWidth, setProductWidth] = useState(0);

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
      <a href={`product_page.html?id=${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <img src={`/images/${product.images[0]}`} alt={product.title} />
        <h5>{product.title}</h5>
        <p><strong>{product.price}</strong></p>
        <p>Rating: {product.rating} ⭐</p>
      </a>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <header className="p-3 text-center">
        <div className="container">
          <div className="d-flex justify-content-end">
            <a href="profile.html" className="btn btn-outline-secondary me-2">👤</a>
            <a href="cart.html" className="btn btn-outline-secondary">🛒</a>
          </div>
          <div className="d-flex justify-content-center align-items-center mb-2 flex-wrap">
            <div className="d-flex me-3">
              <a href="category.html?category=Appliances" className="btn btn-outline-secondary me-2">Appliances</a>
              <a href="category.html?category=Kitchenware" className="btn btn-outline-secondary">Kitchenware</a>
            </div>
            <h1 className="logo mx-3">SwiftCart</h1>
            <div className="d-flex ms-3">
              <a href="category.html?category=Footwear" className="btn btn-outline-secondary me-2">Shoes</a>
              <a href="category.html?category=Clothing" className="btn btn-outline-secondary">Clothing</a>
            </div>
          </div>
          <div className="input-group mb-3 w-50 mx-auto">
            <input type="text" className="form-control" id="searchInput" placeholder="Type to Search..." aria-label="Search" />
            <button className="btn btn-outline-secondary" id="searchButton" type="button">🔍</button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main>
        <h1 className="featured-products">Featured Products</h1>
        <div className="carousel-container">
          <button className="carousel-prev" onClick={() => slideCarousel("prev")}>&#10094;</button>
          <div className="carousel-wrapper">
            <div className="carousel" id="carouselItems">
              {products.map((product) => createProductCard(product))}
            </div>
          </div>
          <button className="carousel-next" onClick={() => slideCarousel("next")}>&#10095;</button>
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
            <a href="about.html">About</a>
          </h2>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
