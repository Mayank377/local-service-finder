document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");
    const message = document.getElementById("message");
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");

    // Show / Hide Password
    togglePassword.addEventListener("click", () => {

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePassword.textContent = "🙈";
        } else {
            passwordInput.type = "password";
            togglePassword.textContent = "👁";
        }

    });

    // Login
    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = passwordInput.value.trim();

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

                // Save complete user data
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                message.style.color = "green";
                message.textContent = "✅ Login Successful";

                setTimeout(() => {
                    window.location.href = "lsf.html"; // change to index.html if that's your landing page
                }, 1000);

            } else {

                message.style.color = "red";
                message.textContent = data.message;

            }

        } catch (error) {

            console.error(error);

            message.style.color = "red";
            message.textContent = "Unable to connect to the server.";

        }

    });

});