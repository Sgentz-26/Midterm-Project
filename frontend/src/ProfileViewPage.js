import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./styles/profileView.css";

const ProfileViewPage = () => {
  const [user, setUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
d
  useEffect(() => {
    // On mount, re-check localStorage to ensure the latest user info
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/profile");
    } else {
      setUser(storedUser);
      setUpdatedUser(storedUser);
    }
  }, [navigate]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error updating profile.");
      }

      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Update error:", error);
      alert(error.message || "Error updating profile.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/profile");
  };

  const handleDeleteAccount = async () => {
    const password = prompt("Please enter your password to confirm deletion:");
    if (!password) return;

    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error deleting account.");
      }

      localStorage.removeItem("user");
      alert("Account deleted successfully.");
      navigate("/");
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.message || "Error deleting account.");
    }
  };

  if (!user) {
    // If user isn't loaded yet, show a loading state
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-view-page">
      <header className="profile-header">
        <h1>Profile</h1>
        <Link to="/" className="back-to-shopping">
          ← Back to Shopping
        </Link>
      </header>

      <main className="profile-main">
        <h2>Welcome, {user.firstName}!</h2>
        <div className="profile-grid">
          <div>
            <label>First Name:</label>
            {isEditing ? (
              <input
                type="text"
                value={updatedUser?.firstName || ""}
                onChange={(e) => setUpdatedUser({ ...updatedUser, firstName: e.target.value })}
              />
            ) : (
              <p>{user.firstName || "Not Provided"}</p>
            )}
          </div>
          <div>
            <label>Last Name:</label>
            {isEditing ? (
              <input
                type="text"
                value={updatedUser?.lastName || ""}
                onChange={(e) => setUpdatedUser({ ...updatedUser, lastName: e.target.value })}
              />
            ) : (
              <p>{user.lastName || "Not Provided"}</p>
            )}
          </div>
          <div>
            <label>Email:</label>
            {isEditing ? (
              <input
                type="email"
                value={updatedUser?.email || ""}
                onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
              />
            ) : (
              <p>{user.email || "Not Provided"}</p>
            )}
          </div>
          <div>
            <label>Phone:</label>
            {isEditing ? (
              <input
                type="tel"
                value={updatedUser?.phone || ""}
                onChange={(e) => setUpdatedUser({ ...updatedUser, phone: e.target.value })}
              />
            ) : (
              <p>{user.phone || "Not Provided"}</p>
            )}
          </div>
          <div>
            <label>Birthday:</label>
            {isEditing ? (
              <input
                type="date"
                value={updatedUser?.birthday || ""}
                onChange={(e) => setUpdatedUser({ ...updatedUser, birthday: e.target.value })}
              />
            ) : (
              <p>{user.birthday || "Not Provided"}</p>
            )}
          </div>
        </div>

        <div className="button-group">
          {isEditing ? (
            <button className="save-changes-btn" onClick={handleUpdate}>
              Save Changes
            </button>
          ) : (
            <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            Log Out
          </button>
          <button className="delete-account-btn" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
      </main>

      <footer className="profile-footer">
        <p>© 2024 SwiftCart. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default ProfileViewPage;
