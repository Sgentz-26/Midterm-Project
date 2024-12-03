import React, { useState } from "react";

const ProfilePage = () => {
  const [account, setAccount] = useState(() =>
    JSON.parse(localStorage.getItem("account"))
  );
  const [authView, setAuthView] = useState("signin"); // "signup" or "profile"
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
    newUsername: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const saveAccount = (username, password) => {
    const account = { username, password };
    localStorage.setItem("account", JSON.stringify(account));
    setAccount(account);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (account) {
      alert("Account already exists. Please sign in.");
      return;
    }
    saveAccount(formValues.username, formValues.password);
    alert("Account created successfully!");
    setAuthView("signin");
    setFormValues({ username: "", password: "" });
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    if (
      account &&
      account.username === formValues.username &&
      account.password === formValues.password
    ) {
      alert("Sign-in successful!");
      setAuthView("profile");
    } else {
      alert("Invalid username or password.");
    }
    setFormValues({ username: "", password: "" });
  };

  const handleEditProfile = (e) => {
    e.preventDefault();
    if (!account) {
      alert("No account found. Please sign up.");
      return;
    }
    const updatedAccount = {
      username: formValues.newUsername || account.username,
      password: formValues.newPassword || account.password,
    };
    saveAccount(updatedAccount.username, updatedAccount.password);
    alert("Profile updated successfully!");
    setFormValues({ newUsername: "", newPassword: "" });
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem("account");
    setAccount(null);
    setAuthView("signin");
    alert("Account deleted successfully!");
  };

  return (
    <div>
      {authView === "signin" && (
        <form onSubmit={handleSignIn}>
          <h2>Sign In</h2>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formValues.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formValues.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Sign In</button>
          <button type="button" onClick={() => setAuthView("signup")}>
            Create Account
          </button>
        </form>
      )}

      {authView === "signup" && (
        <form onSubmit={handleSignUp}>
          <h2>Sign Up</h2>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formValues.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formValues.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Sign Up</button>
          <button type="button" onClick={() => setAuthView("signin")}>
            Back to Sign In
          </button>
        </form>
      )}

      {authView === "profile" && (
        <div>
          <h2>Profile Settings</h2>
          <form onSubmit={handleEditProfile}>
            <input
              type="text"
              name="newUsername"
              placeholder="Edit Username"
              value={formValues.newUsername}
              onChange={handleChange}
            />
            <input
              type="password"
              name="newPassword"
              placeholder="Edit Password"
              value={formValues.newPassword}
              onChange={handleChange}
            />
            <button type="submit">Save Changes</button>
          </form>
          <button onClick={handleDeleteAccount}>Delete Account</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
