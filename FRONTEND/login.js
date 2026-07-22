document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const message = document.getElementById("message");
    const togglePassword = document.getElementById("togglePassword");

    // ===============================
    // Show / Hide Password
    // ===============================
    if (togglePassword) {

        togglePassword.addEventListener("click", () => {

            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                togglePassword.textContent = "🙈";
            } else {
                passwordInput.type = "password";
                togglePassword.textContent = "👁";
            }

        });

    }

    // ===============================
    // Login Form
    // ===============================
    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validation
        if (!email || !password) {
            showMessage("Please enter email and password.", "red");
            return;
        }

        try {

            const response = await fetch("http://localhost:5000/api/users/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })

            });

            const data = await response.json();

            if (response.ok) {

                // Save JWT Token
                localStorage.setItem("token", data.token);

                // Save User (if available)
                if (data.user) {
                    localStorage.setItem("user", JSON.stringify(data.user));
                }

                showMessage("✅ Login Successful!", "green");

                setTimeout(() => {

                    // Redirect to Landing Page
                    window.location.href = "lsf.html";

                }, 1000);

            } else {

                showMessage(data.message || "Invalid Email or Password", "red");

            }

        } catch (error) {

            console.error("Login Error:", error);

            showMessage("❌ Unable to connect to the server.", "red");

        }

    });

    // ===============================
    // Helper Function
    // ===============================
    function showMessage(text, color) {

        message.textContent = text;
        message.style.color = color;

    }

});