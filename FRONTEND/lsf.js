/* ==========================================================
   LOCAL SERVICE FINDER
   Module 1
========================================================== */

const API_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const userMenu = document.getElementById("userMenu");
const welcomeUser = document.getElementById("welcomeUser");
const addServiceBtn = document.getElementById("addServiceBtn");

const modal = document.getElementById("serviceModal");

// ===============================
// Check Login
// ===============================

function checkLogin() {

    if (token && user) {

        loginBtn.style.display = "none";
        registerBtn.style.display = "none";

        userMenu.style.display = "flex";

        welcomeUser.innerHTML = `👋 ${user.name}`;

    }

}

// ===============================
// Logout
// ===============================

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";

}

// ===============================
// Open Modal
// ===============================

function openModal() {

    modal.style.display = "flex";

}

// ===============================
// Close Modal
// ===============================

function closeModal() {

    modal.style.display = "none";

}

// Open modal button

if (addServiceBtn) {

    addServiceBtn.addEventListener("click", openModal);

}

// Close on outside click

window.onclick = function (e) {

    if (e.target === modal) {

        closeModal();

    }

};

// Run on page load

checkLogin();
/* ==========================================================
   Module 2
   Load Services + Search
========================================================== */

const providerGrid = document.getElementById("providerGrid");

const searchBtn = document.getElementById("searchBtn");
const searchService = document.getElementById("searchService");
const searchCity = document.getElementById("searchCity");

// ===============================
// Load Services
// ===============================

async function loadServices() {

    try {

        providerGrid.innerHTML = `
            <div class="loading">
                <i class="fa-solid fa-spinner fa-spin"></i>
                <h3>Loading Professionals...</h3>
            </div>
        `;

        let url = `${API_URL}/services`;

        const params = [];

        if (searchService.value.trim()) {
            params.push(`search=${encodeURIComponent(searchService.value.trim())}`);
        }

        if (searchCity.value.trim()) {
            params.push(`city=${encodeURIComponent(searchCity.value.trim())}`);
        }

        if (params.length > 0) {
            url += "?" + params.join("&");
        }

        const response = await fetch(url);

        const data = await response.json();

        providerGrid.innerHTML = "";

        if (!data.success || data.services.length === 0) {

            providerGrid.innerHTML = `
                <div class="loading">
                    <h2>No Services Found</h2>
                </div>
            `;

            return;
        }

        data.services.forEach(service => {

            const isOwner =
                token &&
                user &&
                service.user &&
                service.user._id === user.id;

            providerGrid.innerHTML += `

                <div class="provider-card">

                    <span class="verified">
                        <i class="fa-solid fa-circle-check"></i>
                        Verified
                    </span>

                    <img src="images/provider1.jpg" alt="Professional">

                    <h3>${service.name}</h3>

                    <p>${service.category}</p>

                    <div class="rating">

                        ⭐⭐⭐⭐⭐

                        <span>(4.9)</span>

                    </div>

                    <p>
                        <i class="fa-solid fa-location-dot"></i>
                        ${service.city}
                    </p>

                    <h4>₹${service.price}</h4>

                    <p>${service.description}</p>

                    <button class="primary-btn">
                        Book Now
                    </button>

                    ${
                        isOwner
                            ? `
                            <div class="action-buttons">

                                <button
                                    class="edit-btn"
                                    onclick="editService('${service._id}')">

                                    Edit

                                </button>

                                <button
                                    class="delete-btn"
                                    onclick="deleteService('${service._id}')">

                                    Delete

                                </button>

                            </div>
                            `
                            : ""
                    }

                </div>

            `;

        });

    }
    catch (error) {

        console.error(error);

        providerGrid.innerHTML = `
            <div class="loading">
                <h2>Unable to connect to server.</h2>
            </div>
        `;

    }

}

// ===============================
// Search Button
// ===============================

if (searchBtn) {

    searchBtn.addEventListener("click", loadServices);

}

if (searchService) {

    searchService.addEventListener("keyup", e => {

        if (e.key === "Enter") {

            loadServices();

        }

    });

}

if (searchCity) {

    searchCity.addEventListener("keyup", e => {

        if (e.key === "Enter") {

            loadServices();

        }

    });

}

// Initial Load

loadServices();
/* ==========================================================
   Module 3
   Add • Edit • Delete Services
========================================================== */

let editingServiceId = null;

// ===============================
// Save Service
// ===============================

const serviceForm = document.getElementById("serviceForm");

if (serviceForm) {

    serviceForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const service = {
            name: document.getElementById("serviceName").value.trim(),
            category: document.getElementById("serviceCategory").value,
            city: document.getElementById("serviceCity").value.trim(),
            price: Number(document.getElementById("servicePrice").value),
            description: document.getElementById("serviceDescription").value.trim()
        };

        try {

            const url = editingServiceId
                ? `${API_URL}/services/${editingServiceId}`
                : `${API_URL}/services`;

            const method = editingServiceId ? "PUT" : "POST";

            const response = await fetch(url, {

                method,

                headers: {

                    "Content-Type": "application/json",

                    "Authorization": `Bearer ${token}`

                },

                body: JSON.stringify(service)

            });

            const data = await response.json();

            if (!response.ok) {

                alert(data.message);

                return;

            }

            alert(editingServiceId
                ? "Service Updated Successfully"
                : "Service Added Successfully");

            serviceForm.reset();

            editingServiceId = null;

            closeModal();

            loadServices();

        }
        catch (error) {

            console.error(error);

            alert("Unable to connect to server.");

        }

    });

}

// ===============================
// Edit Service
// ===============================

async function editService(id) {

    try {

        const response = await fetch(`${API_URL}/services/${id}`);

        const data = await response.json();

        if (!data.success) {

            alert("Service not found.");

            return;

        }

        editingServiceId = id;

        document.getElementById("serviceName").value = data.service.name;
        document.getElementById("serviceCategory").value = data.service.category;
        document.getElementById("serviceCity").value = data.service.city;
        document.getElementById("servicePrice").value = data.service.price;
        document.getElementById("serviceDescription").value = data.service.description;

        openModal();

    }
    catch (error) {

        console.error(error);

    }

}

// ===============================
// Delete Service
// ===============================

async function deleteService(id) {

    if (!confirm("Are you sure you want to delete this service?")) {

        return;

    }

    try {

        const response = await fetch(`${API_URL}/services/${id}`, {

            method: "DELETE",

            headers: {

                "Authorization": `Bearer ${token}`

            }

        });

        const data = await response.json();

        alert(data.message);

        loadServices();

    }
    catch (error) {

        console.error(error);

    }

}
/* ==========================================================
   Module 4
   UI Effects & Animations
========================================================== */

// ==========================
// AOS Animation
// ==========================
if (typeof AOS !== "undefined") {

    AOS.init({
        duration: 1000,
        once: true
    });

}

// ==========================
// Scroll To Top Button
// ==========================

const scrollBtn = document.getElementById("scrollTop");

if (scrollBtn) {

    scrollBtn.style.display = "none";

    window.addEventListener("scroll", () => {

        if (window.scrollY > 400) {

            scrollBtn.style.display = "flex";

        } else {

            scrollBtn.style.display = "none";

        }

    });

    scrollBtn.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}

// ==========================
// FAQ
// ==========================

const questions = document.querySelectorAll(".faq-question");

questions.forEach(question => {

    question.addEventListener("click", () => {

        const answer = question.nextElementSibling;

        document.querySelectorAll(".faq-answer").forEach(item => {

            if (item !== answer) {

                item.style.display = "none";

            }

        });

        answer.style.display =

            answer.style.display === "block"

                ? "none"

                : "block";

    });

});

document.querySelectorAll(".faq-answer").forEach(answer => {

    answer.style.display = "none";

});

// ==========================
// Counter Animation
// ==========================

const counters = document.querySelectorAll(".mini-stats h3");

const runCounter = counter => {

    const target = parseInt(counter.innerText);

    if (isNaN(target)) return;

    let count = 0;

    const increment = target / 80;

    function update() {

        count += increment;

        if (count < target) {

            counter.innerText = Math.floor(count) + "+";

            requestAnimationFrame(update);

        } else {

            counter.innerText = target + "+";

        }

    }

    update();

};

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            runCounter(entry.target);

            observer.unobserve(entry.target);

        }

    });

});

counters.forEach(counter => {

    observer.observe(counter);

});

// ==========================
// Navbar Shadow
// ==========================

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    if (!header) return;

    if (window.scrollY > 60) {

        header.style.boxShadow =

            "0 10px 25px rgba(0,0,0,.15)";

    } else {

        header.style.boxShadow =

            "0 4px 12px rgba(0,0,0,.08)";

    }

});

// ==========================
// Newsletter
// ==========================

const newsletter = document.querySelector(".newsletter form");

if (newsletter) {

    newsletter.addEventListener("submit", e => {

        e.preventDefault();

        alert("Thank you for subscribing!");

        newsletter.reset();

    });

}

// ==========================
// Contact Form
// ==========================

const contactForm = document.querySelector(".contact-form");

if (contactForm) {

    contactForm.addEventListener("submit", e => {

        e.preventDefault();

        alert("Message sent successfully!");

        contactForm.reset();

    });

}

console.log("Local Service Finder Loaded Successfully 🚀");