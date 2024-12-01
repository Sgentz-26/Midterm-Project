import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/cart.css"; // Ensure this path is correct

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState("0.00");

  // Load cart from localStorage when component mounts
  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(cartData);
  }, []);

  // Update cartTotal whenever cart changes
  useEffect(() => {
    const total = cart.reduce((sum, item) => {
      const itemTotal =
        parseFloat(item.price.replace("$", "")) * item.quantity;
      return sum + itemTotal;
    }, 0);
    setCartTotal(total.toFixed(2));
  }, [cart]);

  const saveCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = parseInt(quantity) || 1; // Ensure quantity is at least 1
    saveCart(updatedCart);
  };

  const handleRemoveItem = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    saveCart(updatedCart);
  };

  return (
    <div className="cart-page">
      {/* Header */}
      <header className="py-4 text-white text-center d-flex justify-content-between align-items-center px-3">
        {/* Back Arrow */}
        <Link to="/" className="btn btn-outline-light">
          Continue Shopping
        </Link>

        {/* Cart Title */}
        <h1 className="flex-grow-1 text-center">Your Cart</h1>

        {/* Profile Icon */}
        <div className="d-flex justify-content-end">
          <Link to="/profile" className="btn btn-outline-secondary me-2">
            👤
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container my-4">
        <div className="table-responsive">
          <table className="table table-striped align-middle" id="cartTable">
            <thead className="table-dark">
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th style={{ width: "100px" }}>Quantity</th>
                <th>Total</th>
                <th></th> {/* Remove button column */}
              </tr>
            </thead>
            <tbody id="cartItems">
              {cart.length > 0 ? (
                cart.map((item, index) => {
                  const itemTotal = (
                    parseFloat(item.price.replace("$", "")) * item.quantity
                  ).toFixed(2);
                  return (
                    <tr key={index}>
                      <td>{item.title}</td>
                      <td>{item.price}</td>
                      <td>
                        <input
                          type="number"
                          value={item.quantity}
                          min="1"
                          className="form-control quantity-input"
                          data-index={index}
                          onChange={(e) =>
                            handleQuantityChange(index, e.target.value)
                          }
                        />
                      </td>
                      <td>${itemTotal}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm remove-item"
                          data-index={index}
                          onClick={() => handleRemoveItem(index)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    Your cart is empty.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-end align-items-center mt-4">
          <h3 className="me-3" id="cartTotal">
            Total: ${cartTotal}
          </h3>
          <button className="btn btn-success" id="checkoutButton">
            Proceed to Checkout
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-white text-center">
        <div className="container">
          <p className="mb-1">
            <strong>Author:</strong> Tirmidi and Samuel
            <br />
            <strong>Date:</strong> 10/20/2024
          </p>
          <h2 className="about">
            <Link to="/about" className="text-white text-decoration-underline">
              About
            </Link>
          </h2>
        </div>
      </footer>
    </div>
  );
};

export default CartPage;
