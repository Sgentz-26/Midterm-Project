import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/profile.css";

const ProfilePage = () => {
  const [isSignUp, setIsSignUp] = useState(false); 
  const navigate = useNavigate();

  // Sign-up form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Login form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Check if user is already logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      navigate("/profile-view");
    }
  }, [navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !phone || !birthday || !password || !confirmPassword) {
      alert("Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, phone, birthday, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occurred during sign-up.");
      }

      alert(data.message);
      setIsSignUp(false); 
    } catch (error) {
      console.error("Sign-up error:", error);
      alert(error.message || "Error creating account.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occurred during login.");
      }

      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/profile-view");
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message || "Error logging in.");
    }
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <Link to="/" className="back-button">
          ← Back to Shopping
        </Link>
      </header>

      <div className="auth-section">
        {isSignUp ? (
          <>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp}>
              <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              <input type="date" placeholder="Birthday" value={birthday} onChange={(e) => setBirthday(e.target.value)} required />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              <button type="submit">Sign Up</button>
            </form>
            <button className="toggle-auth-btn" onClick={() => setIsSignUp(false)}>
              Already have an account? Log In
            </button>
          </>
        ) : (
          <>
            <h2>Log In</h2>
            <form onSubmit={handleLogin}>
              <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
              <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
              <button type="submit">Log In</button>
            </form>
            <button className="toggle-auth-btn" onClick={() => setIsSignUp(true)}>
              Don't have an account? Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
