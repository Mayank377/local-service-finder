/* ==========================================
LOCAL SERVICE FINDER
lsf.js
========================================== */

// AOS Animation
AOS.init({
    duration: 1000,
    once: true
});

// =============================
// Scroll To Top Button
// =============================

const scrollBtn = document.getElementById("scrollTop");

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

// Hide initially
scrollBtn.style.display = "none";

// =============================
// FAQ Accordion
// =============================

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

// Hide FAQ answers on page load

document.querySelectorAll(".faq-answer").forEach(answer => {

    answer.style.display = "none";

});

// =============================
// Animated Counter
// =============================

const counters = document.querySelectorAll(".stat-card h2");

const runCounter = (counter) => {

    const target = parseInt(counter.innerText);

    let count = 0;

    const speed = target / 80;

    const update = () => {

        count += speed;

        if (count < target) {

            counter.innerText = Math.floor(count);

            requestAnimationFrame(update);

        } else {

            counter.innerText = target + "+";

        }

    };

    update();

};

const observer = new IntersectionObserver((entries) => {

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

// =============================
// Navbar Shadow
// =============================

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        header.style.boxShadow = "0 10px 30px rgba(0,0,0,.12)";

    } else {

        header.style.boxShadow = "0 5px 20px rgba(0,0,0,.06)";

    }

});