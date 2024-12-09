import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CancelPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000); // Redirect after 5 seconds

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [navigate]);

  return (
    <div>
      <h1>Payment Cancelled</h1>
      <p>Your payment was not completed.</p>
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

export default CancelPage;
