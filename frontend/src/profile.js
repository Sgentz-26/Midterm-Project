document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signup-form");
    const signinForm = document.getElementById("signin-form");
    const editProfileForm = document.getElementById("edit-profile-form");
    const deleteAccountButton = document.getElementById("delete-account");
    const profileSection = document.getElementById("profile-section");
    const authSection = document.getElementById("auth-section");

    // Function to save account in localStorage
    const saveAccount = (username, password) => {
        localStorage.setItem("account", JSON.stringify({ username, password }));
    };

    // Sign Up Handler
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("signup-username").value;
        const password = document.getElementById("signup-password").value;

        if (localStorage.getItem("account")) {
            alert("Account already exists. Please sign in.");
            return;
        }

        saveAccount(username, password);
        alert("Account created successfully! Please sign in.");
        signupForm.reset();
    });

    // Sign In Handler
    signinForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("signin-username").value;
        const password = document.getElementById("signin-password").value;

        const account = JSON.parse(localStorage.getItem("account"));
        if (account && account.username === username && account.password === password) {
            alert("Sign-in successful!");
            authSection.style.display = "none";
            profileSection.style.display = "block";
        } else {
            alert("Invalid username or password.");
        }
        signinForm.reset();
    });

    // Edit Profile Handler
    editProfileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newUsername = document.getElementById("edit-username").value;
        const newPassword = document.getElementById("edit-password").value;

        const account = JSON.parse(localStorage.getItem("account"));
        if (!account) {
            alert("No account found. Please sign up.");
            return;
        }

        const updatedAccount = {
            username: newUsername || account.username,
            password: newPassword || account.password,
        };

        saveAccount(updatedAccount.username, updatedAccount.password);
        alert("Profile updated successfully!");
        editProfileForm.reset();
    });

    // Delete Account Handler
    deleteAccountButton.addEventListener("click", () => {
        localStorage.removeItem("account");
        alert("Account deleted successfully!");
        authSection.style.display = "block";
        profileSection.style.display = "none";
    });
});
