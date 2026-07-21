// =====================================
// Local Service Finder JavaScript
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // Explore Services
    // =====================================

    const exploreBtn = document.getElementById("exploreBtn");

    if (exploreBtn) {
        exploreBtn.addEventListener("click", () => {
            document.getElementById("services").scrollIntoView({
                behavior: "smooth"
            });
        });
    }

    // =====================================
    // Search Service
    // =====================================

    const searchBtn = document.getElementById("searchBtn");

    if (searchBtn) {
        searchBtn.addEventListener("click", () => {

            const inputs = document.querySelectorAll(".search input");

            const service = inputs[0].value.trim();
            const location = inputs[1].value.trim();

            if (!service || !location) {
                alert("⚠ Please enter both Service Name and Location.");
                return;
            }

            alert(`🔍 Searching for "${service}" in "${location}"...`);

            // Backend integration will be added later.
        });
    }

    // =====================================
    // Login / Register / Logout
    // =====================================

    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");

    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {

        loginBtn.textContent = `👋 ${user.name}`;
        loginBtn.disabled = true;

        registerBtn.textContent = "Logout";

        registerBtn.addEventListener("click", () => {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            alert("Logged out successfully.");

            window.location.reload();

        });

    } else {

        if (loginBtn) {
            loginBtn.addEventListener("click", () => {
                window.location.href = "login.html";
            });
        }

        if (registerBtn) {
            registerBtn.addEventListener("click", () => {
                window.location.href = "register.html";
            });
        }

    }

    // =====================================
    // Book Now Buttons
    // =====================================

    const bookButtons = document.querySelectorAll(".bookBtn");

    bookButtons.forEach(button => {

        button.addEventListener("click", function () {

            const loggedInUser = JSON.parse(localStorage.getItem("user"));

            if (!loggedInUser) {

                alert("Please login first to book a service.");

                window.location.href = "login.html";

                return;
            }

            const provider = this.parentElement.querySelector("h3").textContent;

            alert(`✅ Booking request sent to ${provider}`);

            // Booking API will be connected later.

        });

    });

    // =====================================
    // Contact Form
    // =====================================

    const contactForm = document.querySelector(".contact form");

    if (contactForm) {

        contactForm.addEventListener("submit", function (e) {

            e.preventDefault();

            const name = this.querySelector("input[type='text']").value.trim();
            const email = this.querySelector("input[type='email']").value.trim();
            const message = this.querySelector("textarea").value.trim();

            if (!name || !email || !message) {
                alert("⚠ Please fill in all fields.");
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {
                alert("⚠ Please enter a valid email address.");
                return;
            }

            alert("✅ Thank you! Your message has been sent successfully.");

            this.reset();

        });

    }

});