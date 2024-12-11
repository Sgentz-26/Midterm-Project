import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const clearCart = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          const response = await fetch(`http://localhost:5000/api/users/${user.id}/cart`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cart: [] }), // Clear the cart by setting it to an empty array
          });

          if (response.ok) {
            console.log('Cart cleared successfully');
          } else {
            console.error('Failed to clear cart');
          }
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    };

    // Clear the cart when the component mounts
    clearCart();

    // Redirect to homepage after 5 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Thank you for your purchase.</p>
      <p>
        You will be redirected to the homepage shortly. If not, click{' '}
        <a href="/" onClick={() => navigate('/')}>
          here
        </a>
        .
      </p>
    </div>
  );
};

export default SuccessPage;
