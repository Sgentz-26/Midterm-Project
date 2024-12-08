import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/cart.css";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [saved, setSaved] = useState([]);
  const [cartTotal, setCartTotal] = useState("0.00");

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/profile");
      return;
    }

    // Fetch both cart and saved items on mount
    Promise.all([
      fetch(`http://localhost:5000/api/users/${user.id}/cart`).then(res => res.ok ? res.json() : Promise.reject(res.text())),
      fetch(`http://localhost:5000/api/users/${user.id}/saved`).then(res => res.ok ? res.json() : Promise.reject(res.text()))
    ]).then(([cartData, savedData]) => {
      setCart(cartData.cart || []);
      setSaved(savedData.saved || []);
    }).catch(error => {
      console.error("Error fetching cart or saved items:", error);
    });
  }, [user, navigate]);

  useEffect(() => {
    const total = cart.reduce((sum, item) => {
      const priceNum = typeof item.price === "string" ? parseFloat(item.price) : item.price;
      return sum + (priceNum * item.quantity);
    }, 0);
    setCartTotal(total.toFixed(2));
  }, [cart]);

  const saveCartToBackend = async (updatedCart) => {
    const response = await fetch(`http://localhost:5000/api/users/${user.id}/cart`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart: updatedCart }),
    });
    return response.ok;
  };

  const saveSavedToBackend = async (updatedSaved) => {
    const response = await fetch(`http://localhost:5000/api/users/${user.id}/saved`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ saved: updatedSaved }),
    });
    return response.ok;
  };

  const handleQuantityChange = async (index, quantity) => {
    const oldCart = [...cart];
    const updatedCart = [...cart];
    updatedCart[index].quantity = parseInt(quantity, 10) || 1;
    setCart(updatedCart);

    const success = await saveCartToBackend(updatedCart);
    if (!success) {
      setCart(oldCart);
      alert("Failed to update quantity. Please try again.");
    }
  };

  const handleRemoveItem = async (index) => {
    const oldCart = [...cart];
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);

    const success = await saveCartToBackend(updatedCart);
    if (!success) {
      setCart(oldCart);
      alert("Failed to remove item. Please try again.");
    }
  };

  const handleMoveToSaved = async (index) => {
    // Move item from cart to saved
    const item = cart[index];
    const oldCart = [...cart];
    const oldSaved = [...saved];

    const updatedCart = [...cart];
    updatedCart.splice(index, 1);

    const existing = saved.find((s) => s.id === item.id);
    let updatedSaved;
    if (existing) {
      alert("This item is already in your Saved for Later.");
      return; // Cancel move
    } else {
      updatedSaved = [...saved, { ...item }];
    }

    setCart(updatedCart);
    setSaved(updatedSaved);

    const cartSuccess = await saveCartToBackend(updatedCart);
    const savedSuccess = await saveSavedToBackend(updatedSaved);

    if (!cartSuccess || !savedSuccess) {
      setCart(oldCart);
      setSaved(oldSaved);
      alert("Failed to move item to Saved for Later.");
    }
  };

  const handleMoveToCart = async (index) => {
    // Move item from saved to cart
    const item = saved[index];
    const oldCart = [...cart];
    const oldSaved = [...saved];

    const updatedSaved = [...saved];
    updatedSaved.splice(index, 1);

    const existing = cart.find((c) => c.id === item.id);
    let updatedCart;
    if (existing) {
      updatedCart = cart.map((c) =>
        c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
      );
    } else {
      updatedCart = [...cart, { ...item }];
    }

    setCart(updatedCart);
    setSaved(updatedSaved);

    const cartSuccess = await saveCartToBackend(updatedCart);
    const savedSuccess = await saveSavedToBackend(updatedSaved);

    if (!cartSuccess || !savedSuccess) {
      setCart(oldCart);
      setSaved(oldSaved);
      alert("Failed to move item to Cart.");
    }
  };

  const handleRemoveFromSaved = async (index) => {
    // Remove item from saved entirely
    const oldSaved = [...saved];
    const updatedSaved = [...saved];
    updatedSaved.splice(index, 1);
    setSaved(updatedSaved);

    const success = await saveSavedToBackend(updatedSaved);
    if (!success) {
      setSaved(oldSaved);
      alert("Failed to remove item from Saved. Please try again.");
    }
  };

  return (
    <div className="cart-page">
      {/* Header */}
      <header className="py-4 text-white text-center d-flex justify-content-between align-items-center px-3" style={{ backgroundColor: '#333' }}>
        <Link to="/" className="btn btn-outline-light">Continue Shopping</Link>
        <h1 className="flex-grow-1 text-center">Your Cart</h1>
        <div className="d-flex justify-content-end">
          <Link to="/profile" className="btn btn-outline-secondary me-2">👤</Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container my-4">
        <h2>Your Cart Items</h2>
        <div className="table-responsive mb-5">
          <table className="table table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th style={{ width: "100px" }}>Quantity</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.length > 0 ? (
                cart.map((item, index) => {
                  const priceNum = typeof item.price === "string" ? parseFloat(item.price) : item.price;
                  const itemTotal = (priceNum * item.quantity).toFixed(2);
                  return (
                    <tr key={index}>
                      <td>{item.title}</td>
                      <td>${priceNum.toFixed(2)}</td>
                      <td>
                        <input
                          type="number"
                          value={item.quantity}
                          min="1"
                          className="form-control quantity-input"
                          onChange={(e) => handleQuantityChange(index, e.target.value)}
                        />
                      </td>
                      <td>${itemTotal}</td>
                      <td className="d-flex gap-2">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveItem(index)}
                        >
                          Remove
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleMoveToSaved(index)}
                        >
                          Move to Saved
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">Your cart is empty.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-end align-items-center mb-5">
          <h3 className="me-3">Total: ${cartTotal}</h3>
          <button className="btn btn-success">Proceed to Checkout</button>
        </div>

        <h2>Saved for Later</h2>
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {saved.length > 0 ? (
                saved.map((item, index) => {
                  const priceNum = typeof item.price === "string" ? parseFloat(item.price) : item.price;
                  return (
                    <tr key={index}>
                      <td>{item.title}</td>
                      <td>${priceNum.toFixed(2)}</td>
                      <td className="d-flex gap-2">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleMoveToCart(index)}
                        >
                          Move to Cart
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveFromSaved(index)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">No items saved for later.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-white text-center" style={{ backgroundColor: '#333' }}>
        <div className="container">
          <p className="mb-1">
            <strong>Author:</strong> Tirmidi and Samuel<br />
            <strong>Date:</strong> 10/20/2024
          </p>
          <h2>
            <Link to="/about" className="text-white text-decoration-underline">About</Link>
          </h2>
        </div>
      </footer>
    </div>
  );
};

export default CartPage;
