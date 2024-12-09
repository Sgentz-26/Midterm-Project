import React, { useState, useEffect } from 'react';
import './styles/checkout_page.css';
import { Link } from 'react-router-dom';

const CheckoutPage = () => {
  const [step, setStep] = useState(1); // Track the current step
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });
  const [shippingCost, setShippingCost] = useState(0);
  const [cart, setCart] = useState([]); // Cart data

  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
          alert('Please log in to view your cart.');
          return;
        }
        const response = await fetch(`http://localhost:5000/api/users/${user.id}/cart`);
        if (!response.ok) {
          throw new Error('Failed to fetch cart data');
        }
        const data = await response.json();
        setCart(data.cart || []);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
  
    fetchCart();
  }, []);  

  // Handle input changes for shipping address
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  const calculateShipping = () => {
    setShippingCost(10.99);
    setStep(3);
  };

  const handleCheckout = async () => {
    try {
      const items = cart.map((item) => {
        const priceInCents = Math.round(item.price * 100); // Price in cents
        console.log(`Calculating price for ${item.title}: ${item.price} -> ${priceInCents} cents`);
        return {
          name: item.title,
          price: priceInCents,
          quantity: item.quantity,
        };
      });
  
      const response = await fetch('http://localhost:5000/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });
  
      const { url } = await response.json();
      if (url) {
        window.location.href = url; // Redirect to Stripe Checkout
      } else {
        alert('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('There was an issue with your checkout. Please try again.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="checkout-page-container">
            <h2>Shipping Address</h2>
            <form>
              <label>
                Full Name:
                <input
                  type="text"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Address:
                <input
                  type="text"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                City:
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                State:
                <input
                  type="text"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                ZIP Code:
                <input
                  type="text"
                  name="zip"
                  value={shippingAddress.zip}
                  onChange={handleInputChange}
                />
              </label>
            </form>
            <button onClick={() => setStep(2)}>Next</button>
            <Link to="/cart" className="back-button">
              <button className="back-button">Back</button>
            </Link>
          </div>
        );

      case 2:
        return (
          <div className="checkout-page-container">
            <h2>Calculate Shipping</h2>
            <p>We will calculate your shipping cost based on your address.</p>
            <button onClick={calculateShipping}>Calculate Shipping</button>
            <button className="back-button" onClick={() => setStep(1)}>Back</button>
          </div>
        );

      case 3:
        return (
          <div className="checkout-page-container">
            <h2>Order Summary</h2>
            <p>Shipping Address:</p>
            <p>{shippingAddress.fullName}</p>
            <p>{shippingAddress.address}</p>
            <p>
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
            </p>
            <p>Shipping Cost: ${shippingCost}</p>
            <button onClick={handleCheckout}>Proceed to Payment</button>
            <button className="back-button" onClick={() => setStep(2)}>Back</button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      {renderStep()}
    </div>
  );
};

export default CheckoutPage;
