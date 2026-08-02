/* ==========================================================
   LOCAL SERVICE FINDER
   Module 1 — Authentication & UI State
========================================================== */

const API_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");

let user = null;
try {
    user = JSON.parse(localStorage.getItem("user"));
} catch (e) {
    console.warn("Corrupted user data in localStorage, clearing it.", e);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
}

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const userMenu = document.getElementById("userMenu");
const welcomeUser = document.getElementById("welcomeUser");
const addServiceBtn = document.getElementById("addServiceBtn");

const modal = document.getElementById("serviceModal");

let isSearching = false;
let editingServiceId = null;

// ====================================
// Check Login
// ====================================

function checkLogin() {

    const myServices = document.getElementById("myServices");

    if (token && user) {

        if (loginBtn) loginBtn.style.display = "none";
        if (registerBtn) registerBtn.style.display = "none";

        if (userMenu) {
            userMenu.style.display = "flex";
            welcomeUser.textContent = `👋 ${user.name}`;
        }

        if (myServices) myServices.style.display = "block";

    } else {

        if (myServices) myServices.style.display = "none";

    }

}

// ====================================
// Logout
// ====================================

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

// ====================================
// Open / Close Modal
// ====================================

function openModal() {

    if (!token) {
        showWarning("Please login first.");
        setTimeout(() => { window.location.href = "login.html"; }, 900);
        return;
    }

    modal.style.display = "flex";
}

function closeModal() {
    modal.style.display = "none";

    // Reset "edit mode" state whenever the modal closes
    editingServiceId = null;
    const heading = document.querySelector("#serviceModal h2");
    if (heading) heading.textContent = "Add New Service";
    if (serviceFormRef) serviceFormRef.reset();
}

if (addServiceBtn) {
    addServiceBtn.addEventListener("click", openModal);
}

window.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
});

window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && modal.style.display === "flex") {
        closeModal();
    }
});

checkLogin();

/* ==========================================================
   Module 2 — Services + Search
========================================================== */

const providerGrid = document.getElementById("providerGrid");
const myServicesGrid = document.getElementById("myServicesGrid");


const FALLBACK_PROVIDER_IMAGE =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23E5E7EB'/%3E%3Ccircle cx='100' cy='75' r='35' fill='%239CA3AF'/%3E%3Cpath d='M40 170c0-40 27-65 60-65s60 25 60 65' fill='%239CA3AF'/%3E%3C/svg%3E";

function scrollToProviders() {
    const section = document.getElementById("providers");
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function loadServices() {

    try {

        providerGrid.innerHTML = `
        <div class="loading">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <h3>Loading Services...</h3>
        </div>
        `;

       let url = `${API_URL}/services`;

        const response = await fetch(url);
        const data = await response.json();

        providerGrid.innerHTML = "";

        if (!data.success || data.services.length === 0) {
            showEmptyState(providerGrid, "No Services Found", "Try a different search term or city.");
            return;
        }

        data.services.forEach(service => {
            const isOwner = token && user && service.user && service.user._id === user.id;
            providerGrid.innerHTML += buildProviderCard(service, isOwner);
        });

        if (isSearching) {
            scrollToProviders();
            isSearching = false;
        }

        loadMyServices(data.services);

   } catch (error) {

    console.error("loadServices Error:", error);

    showError(error.message);

}
}


// ======================================
// Category Cards
// ======================================

document.querySelectorAll(".category-card").forEach(card => {

    card.addEventListener("click", () => {

        scrollToProviders();

    });

    // Keyboard support
    card.addEventListener("keydown", function (e) {

        if (e.key === "Enter" || e.key === " ") {

            e.preventDefault();

            scrollToProviders();

        }

    });

});

function loadMyServices(allServices) {

    if (!myServicesGrid) return;
    if (!token || !user) return;

    const myServices = allServices.filter(service => service.user && service.user._id === user.id);

    if (myServices.length === 0) {
        showEmptyState(myServicesGrid, "You haven't added any services yet.", 'Click "+ Add Service" to create your first listing.');
        return;
    }

    myServicesGrid.innerHTML = "";
    myServices.forEach(service => {
        myServicesGrid.innerHTML += buildProviderCard(service, true);
    });
}

function bookService(id) {

    if (!token) {
        showWarning("Please login first.");
        setTimeout(() => { window.location.href = "login.html"; }, 900);
        return;
    }

    showSuccess("🎉 Booking request sent successfully!");
}

loadServices();

/* ==========================================================
   Module 3 — Add / Update Service
========================================================== */

const serviceFormRef = document.getElementById("serviceForm");

if (serviceFormRef) {
    serviceFormRef.addEventListener("submit", saveService);
}

async function saveService(e) {

    e.preventDefault();

    if (!token) {
        showWarning("Please login first.");
        setTimeout(() => { window.location.href = "login.html"; }, 900);
        return;
    }

    const submitBtn = serviceFormRef.querySelector("button[type='submit']");
    startButtonLoading(submitBtn, "Saving...");

    const service = {
        name: document.getElementById("serviceName").value.trim(),
        category: document.getElementById("serviceCategory").value,
        city: document.getElementById("serviceCity").value.trim(),
        price: Number(document.getElementById("servicePrice").value),
        description: document.getElementById("serviceDescription").value.trim()
    };

    if (!service.name || !service.category || !service.city || !service.description || service.price <= 0) {
        showWarning("Please fill all required fields.");
        stopButtonLoading(submitBtn);
        return;
    }

    try {

        const url = editingServiceId ? `${API_URL}/services/${editingServiceId}` : `${API_URL}/services`;
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
            showError(data.message || "Unable to save service.");
            stopButtonLoading(submitBtn);
            return;
        }

        showSuccess(editingServiceId ? "✅ Service Updated Successfully" : "✅ Service Added Successfully");

        editingServiceId = null;
        closeModal();
        loadServices();

    } catch (error) {
        console.error(error);
        showError("Unable to connect to server.");
    } finally {
        stopButtonLoading(submitBtn);
    }
}

/* ==========================================================
   Module 4 — Edit & Delete Services
========================================================== */

async function editService(id) {

    try {

        const response = await fetch(`${API_URL}/services/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
            showError("Service not found.");
            return;
        }

        editingServiceId = id;

        document.getElementById("serviceName").value = data.service.name;
        document.getElementById("serviceCategory").value = data.service.category;
        document.getElementById("serviceCity").value = data.service.city;
        document.getElementById("servicePrice").value = data.service.price;
        document.getElementById("serviceDescription").value = data.service.description;

        document.querySelector("#serviceModal h2").textContent = "Update Service";

        modal.style.display = "flex";

    } catch (error) {
        console.error(error);
        showError("Unable to load service.");
    }
}

async function deleteService(id) {

    if (!confirmDeleteDialog()) return;

    try {

        const response = await fetch(`${API_URL}/services/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await response.json();

        if (!response.ok) {
            showError(data.message || "Delete failed.");
            return;
        }

        showSuccess("🗑️ Service Deleted Successfully");
        loadServices();

    } catch (error) {
        console.error(error);
        showError("Unable to connect to server.");
    }
}

/* ==========================================================
   Module 5 — Toast Notifications & UI Helpers
========================================================== */

function showToast(message, type = "success") {

    let toast = document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }

    toast.className = `toast ${type}`;
    toast.innerHTML = message;
    toast.classList.add("show");

    clearTimeout(toast.hideTimer);
    toast.hideTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function showSuccess(message) { showToast(message, "success"); }
function showError(message) { showToast(message, "error"); }
function showWarning(message) { showToast(message, "warning"); }

function confirmDeleteDialog() {
    return confirm("Are you sure you want to delete this service?");
}

function startButtonLoading(button, text = "Loading...") {
    if (!button) return;
    button.dataset.originalText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${text}`;
}

function stopButtonLoading(button) {
    if (!button) return;
    button.disabled = false;
    button.innerHTML = button.dataset.originalText;
}

function scrollToSection(id) {
    const section = document.getElementById(id);
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showEmptyState(container, title, subtitle = "") {
    container.innerHTML = `
        <div class="loading">
            <i class="fa-regular fa-folder-open"></i>
            <h2>${title}</h2>
            <p>${subtitle}</p>
        </div>
    `;
}

function showServerError(container) {
    container.innerHTML = `
        <div class="loading">
            <i class="fa-solid fa-circle-exclamation"></i>
            <h2>Unable to connect to server</h2>
            <p>Please make sure the backend is running.</p>
        </div>
    `;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* ==========================================================
   Premium Provider Card (single source of truth)
========================================================== */

function buildProviderCard(service, isOwner = false) {

    const phone = service.phone || "9876543210";
    const rating = service.rating || 4.8;
    const experience = service.experience || 5;
    const verified = service.verified ?? true;

    return `
    <div class="provider-card">

        <div class="provider-image">
            <img
                src="${service.image || FALLBACK_PROVIDER_IMAGE}"
                alt="${service.name}"
                onerror="this.onerror=null;this.src='${FALLBACK_PROVIDER_IMAGE}';"
            >
            ${verified ? `
                <span class="verified-badge">
                    <i class="fa-solid fa-circle-check"></i> Verified
                </span>
            ` : ""}
        </div>

        <div class="provider-content">

            <div class="provider-header">
                <h3>${service.name}</h3>
                <button class="favorite-btn" onclick="toggleFavorite(this)">❤</button>
            </div>

            <p class="provider-category">
                <i class="fa-solid fa-screwdriver-wrench"></i> ${service.category}
            </p>

            <p>
                <i class="fa-solid fa-location-dot"></i> ${service.city}
            </p>

            <div class="provider-rating">
                ⭐ ${rating} <span>(${experience}+ Years)</span>
            </div>

            <div class="provider-price">₹${service.price}</div>

            <p class="provider-description">${service.description}</p>

            <div class="provider-actions">
                <button class="primary-btn" onclick="bookService('${service._id}')">Book Now</button>
                <a class="secondary-btn" href="tel:${phone}">
                    <i class="fa-solid fa-phone"></i> Call
                </a>
            </div>

            ${isOwner ? `
            <div class="owner-actions">
                <button class="edit-btn" onclick="editService('${service._id}')">Edit</button>
                <button class="delete-btn" onclick="deleteService('${service._id}')">Delete</button>
            </div>
            ` : ""}

        </div>
    </div>
    `;
}

function toggleFavorite(button) {

    button.classList.toggle("active");

    if (button.classList.contains("active")) {
        button.innerHTML = "❤️";
        showSuccess("Added to Favorites");
    } else {
        button.innerHTML = "❤";
        showSuccess("Removed from Favorites");
    }
}

/* ==========================================================
   Module 8 — Premium UX & Performance
========================================================== */

// ======================================
// Dark Mode (defaults to dark on first visit)
// ======================================

const darkBtn = document.getElementById("darkModeBtn");
const storedTheme = localStorage.getItem("theme");

if (storedTheme === "dark" || storedTheme === null) {
    document.body.classList.add("dark");
    if (storedTheme === null) localStorage.setItem("theme", "dark");
}

if (darkBtn) {

    darkBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {
            localStorage.setItem("theme", "dark");
            showSuccess("Dark Mode Enabled");
        } else {
            localStorage.setItem("theme", "light");
            showSuccess("Light Mode Enabled");
        }

    });
}

// ======================================
// Mobile Hamburger Menu
// ======================================

const menuBtn = document.getElementById("menuBtn");
const navLinksEl = document.querySelector(".nav-links");
const navButtonsEl = document.getElementById("navButtons");

if (menuBtn && navLinksEl) {

    menuBtn.addEventListener("click", () => {
        navLinksEl.classList.toggle("show");
        if (navButtonsEl) navButtonsEl.classList.toggle("show");
        const icon = menuBtn.querySelector("i");
        if (icon) {
            icon.classList.toggle("fa-bars");
            icon.classList.toggle("fa-xmark");
        }
    });

    // Close mobile menu after tapping a nav link
    navLinksEl.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinksEl.classList.remove("show");
            if (navButtonsEl) navButtonsEl.classList.remove("show");
        });
    });
}

// ======================================
// Scroll Spy
// ======================================

const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) current = section.getAttribute("id");
    });

    navItems.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }
    });

    // Scroll-to-top visibility
    const scrollTopBtn = document.getElementById("scrollTop");
    if (scrollTopBtn) {
        scrollTopBtn.classList.toggle("show", window.scrollY > 400);
    }

});

// ======================================
// Scroll To Top Button
// ======================================

const scrollTopBtn = document.getElementById("scrollTop");

if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// ======================================
// Smooth Anchor Scroll
// ======================================

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", e => {

        const targetId = link.getAttribute("href");
        if (targetId.length <= 1) return; // ignore bare "#"

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
    });
});

// ======================================
// FAQ Accordion
// ======================================

document.querySelectorAll(".faq-question").forEach(question => {

    question.addEventListener("click", () => {

        const item = question.closest(".faq-item");
        const wasActive = item.classList.contains("active");

        // Close all, then open the clicked one (unless it was already open)
        document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("active"));

        if (!wasActive) item.classList.add("active");
    });

});

// ======================================
// Newsletter & Contact Form Feedback
// ======================================

const newsletterForm = document.getElementById("newsletterForm");

if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("newsletterEmail").value.trim();
        if (!email) return;
        showSuccess("🎉 Subscribed! Watch your inbox for offers.");
        newsletterForm.reset();
    });
}

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        showSuccess("✅ Message sent! We'll get back to you soon.");
        contactForm.reset();
    });
}

// ======================================
// Lazy Images
// ======================================

document.querySelectorAll("img").forEach(img => {
    img.loading = "lazy";
});

// ======================================
// Skeleton Loading Helper
// ======================================

function showSkeleton(container) {

    container.innerHTML = "";

    for (let i = 0; i < 6; i++) {
        container.innerHTML += `
        <div class="provider-card skeleton">
            <div class="skeleton-img"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line short"></div>
            <div class="skeleton-line"></div>
        </div>
        `;
    }
}

// ======================================
// Online / Offline
// ======================================

window.addEventListener("offline", () => showWarning("Internet Connection Lost"));
window.addEventListener("online", () => showSuccess("Back Online"));

// ======================================
// Console Branding
// ======================================

window.addEventListener("load", () => {
    console.log("🚀 Local Service Finder Loaded");
});

console.log("%cLocal Service Finder", "color:#6366F1;font-size:18px;font-weight:bold;");
console.log("Version 2.1");
console.log("Developed by Mayank Vaish");
console.log("Project Loaded Successfully ✅");