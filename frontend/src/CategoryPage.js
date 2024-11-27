import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/category.css";

const CategoryPage = () => {
    const { category } = useParams(); // Get category from URL
    const [products, setProducts] = useState([]); // All fetched products
    const [displayedProducts, setDisplayedProducts] = useState([]); // Products to display
    const [sortType, setSortType] = useState("default");
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

      useEffect(() => {
        const fetchData = async () => {
          try {
            // Clear `sessionStorage` for new navigation or category
            console.log("Clearing Search Results from sessionStorage");
            // sessionStorage.removeItem("filteredProducts");
      
            // Check for search results in sessionStorage
            const searchResults = sessionStorage.getItem("filteredProducts");
            if (searchResults) {
              const parsedResults = JSON.parse(searchResults);
              if (parsedResults.length > 0) {
                console.log("Displaying Search Results:", parsedResults);
                setProducts(parsedResults); // Set all products to search results
                setDisplayedProducts(parsedResults); // Display search results
                return;
              }
            }
      
            // If no search results, fetch products by category
            if (category && category !== "search-results") {
              console.log("Filtering by Category:", category);
              const response = await fetch("http://localhost:5000/api/products");
              const data = await response.json();
              const filteredProducts = data.filter(
                (product) =>
                  product.category &&
                  product.category.toLowerCase() === category.toLowerCase()
              );
              setProducts(filteredProducts);
              setDisplayedProducts(filteredProducts);
              return;
            }
      
            // If no category or search results, display nothing
            console.log("No category or search results, displaying nothing.");
            setProducts([]);
            setDisplayedProducts([]);
          } catch (error) {
            console.error("Error fetching products:", error);
          }
        };
      
        fetchData();
      }, [category]); // Runs whenever the category changes      

  useEffect(() => {
    // Apply sorting whenever sortType changes
    const sortedProducts = [...products];
    switch (sortType) {
      case "price-low-to-high":
        sortedProducts.sort(
          (a, b) =>
            parseFloat(a.price.replace("$", "")) -
            parseFloat(b.price.replace("$", ""))
        );
        break;
      case "price-high-to-low":
        sortedProducts.sort(
          (a, b) =>
            parseFloat(b.price.replace("$", "")) -
            parseFloat(a.price.replace("$", ""))
        );
        break;
      case "rating-low-to-high":
        sortedProducts.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating));
        break;
      case "rating-high-to-low":
        sortedProducts.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        break;
      default:
        break; // No sorting
    }
    setDisplayedProducts(sortedProducts);
  }, [sortType, products]); // Dependencies updated to include products

  const createProductCard = (product) => (
    <div className="product-card" key={product.id}>
      <img src={`/images/${product.images[0]}`} alt={product.title} />
      <h5>{product.title}</h5>
      <p>
        <strong>{product.price}</strong>
      </p>
      <p>Rating: {product.rating} ⭐</p>
      <Link to={`/product/${product.id}`}>View Product</Link>
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
            <h1 className="logo mx-3">
              <Link to="/">SwiftCart</Link>
            </h1>
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
              id="searchInput"
              placeholder="Type to Search..."
              value={searchTerm} // Bind input to searchTerm
              onChange={(e) => setSearchTerm(e.target.value)} // Update state
              onKeyPress={handleKeyPress} // Trigger search on Enter
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

      {/* Main */}
      <main>
        <h1 id="category-title">{category || "Search Results"}</h1>

        {/* Sorting Options */}
        <div className="sorting-options">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="price-low-to-high">Price: Low to High</option>
            <option value="price-high-to-low">Price: High to Low</option>
            <option value="rating-low-to-high">Rating: Low to High</option>
            <option value="rating-high-to-low">Rating: High to Low</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className="product-grid">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => createProductCard(product))
          ) : (
            <p>No products found</p>
          )}
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

export default CategoryPage;
