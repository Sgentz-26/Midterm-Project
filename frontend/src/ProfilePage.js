import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles/profile.css";

const ProfilePage = () => {
  const [account, setAccount] = useState(() => {
    const savedAccount = localStorage.getItem("account");
    return savedAccount ? JSON.parse(savedAccount) : null;
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // Tracks whether user is on sign-up page

  useEffect(() => {
    if (account) {
      setUsername(account.username);
    }
  }, [account]);

  const handleSignUp = (e) => {
    e.preventDefault();
    if (localStorage.getItem("account")) {
      alert("Account already exists. Please sign in.");
      return;
    }

    const newAccount = { username, password };
    localStorage.setItem("account", JSON.stringify(newAccount));
    setAccount(newAccount);
    alert("Account created successfully! Please sign in.");
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    const savedAccount = JSON.parse(localStorage.getItem("account"));
    if (savedAccount && savedAccount.username === username && savedAccount.password === password) {
      setAccount(savedAccount);
      alert("Sign-in successful!");
    } else {
      alert("Invalid username or password.");
    }
  };

  const handleEditProfile = (e) => {
    e.preventDefault();
    if (!account) {
      alert("No account found. Please sign up.");
      return;
    }

    const updatedAccount = {
      username: editUsername || account.username,
      password: editPassword || account.password,
    };

    localStorage.setItem("account", JSON.stringify(updatedAccount));
    setAccount(updatedAccount);
    alert("Profile updated successfully!");
    setEditUsername("");
    setEditPassword("");
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem("account");
    setAccount(null);
    alert("Account deleted successfully!");
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <Link to="/" className="back-button">
          ← Back to Shopping
        </Link>
      </header>

      {!account ? (
        <div className="auth-section">
          {isSignUp ? (
            <>
              <h2>Sign Up</h2>
              <form onSubmit={handleSignUp}>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="submit">Sign Up</button>
              </form>
              <button className="toggle-auth-btn" onClick={() => setIsSignUp(false)}>
                Already have an account? Log In
              </button>
            </>
          ) : (
            <>
              <h2>Log In</h2>
              <form onSubmit={handleSignIn}>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="submit">Log In</button>
              </form>
              <button className="toggle-auth-btn" onClick={() => setIsSignUp(true)}>
                Don't have an account? Sign Up
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="profile-section">
          <h2>Welcome, {account.username}!</h2>
          <p>Manage your profile below:</p>

          <h3>Edit Profile</h3>
          <form onSubmit={handleEditProfile}>
            <input
              type="text"
              placeholder="New Username"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
            />
            <button type="submit">Save Changes</button>
          </form>

          <button className="delete-account-btn" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
