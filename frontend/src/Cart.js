import React, { useState, useEffect } from "react";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Fetch product data from the backend API
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch product data");
        }
        return response.json();
      })
      .then((data) => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        const updatedCart = storedCart.map((cartItem) => {
          const product = data.find((p) => p.id === cartItem.id);
          return product
            ? { ...cartItem, title: product.title, price: product.price }
            : cartItem;
        });
        setCart(updatedCart);
        calculateTotal(updatedCart);
      })
      .catch((error) => console.error("Error fetching product data:", error));
  }, []);

  const calculateTotal = (cartItems) => {
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.price.replace("$", "")) * item.quantity,
      0
    );
    setTotal(totalAmount.toFixed(2));
  };

  const updateQuantity = (index, newQuantity) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = newQuantity;
    setCart(updatedCart);
    calculateTotal(updatedCart);

    // Update localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    calculateTotal(updatedCart);

    // Update localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <div>
      <header className="py-4 bg-dark text-white text-center d-flex justify-content-between align-items-center px-3">
        {/* Back Arrow */}
        <button onClick={() => window.history.back()} className="btn btn-outline-light">
          Continue Shopping
        </button>

        {/* Cart Title */}
        <h1 className="flex-grow-1 text-center">Your Cart</h1>

        {/* Profile Icon */}
        <div className="d-flex justify-content-end">
          <a href="/profile" className="btn btn-outline-secondary me-2">
            👤
          </a>
        </div>
      </header>

      <main className="container my-4">
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.length > 0 ? (
                cart.map((item, index) => (
                  <tr key={index}>
                    <td>{item.title}</td>
                    <td>{item.price}</td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        className="form-control quantity-input"
                        onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                      />
                    </td>
                    <td>${(item.quantity * parseFloat(item.price.replace("$", ""))).toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeItem(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
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
          <h3 className="me-3">Total: ${total}</h3>
          <button className="btn btn-success">Proceed to Checkout</button>
        </div>
      </main>

      <footer className="py-4 bg-dark text-white text-center">
        <div className="container">
          <p className="mb-1">
            <strong>Author:</strong> Tirmidi and Samuel<br />
            <strong>Date:</strong> 10/20/2024
          </p>
          <h2>
            <a href="/about" className="text-white text-decoration-underline">
              About
            </a>
          </h2>
        </div>
      </footer>
    </div>
  );
};

export default Cart;
