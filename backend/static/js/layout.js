document.addEventListener("DOMContentLoaded", function () {

    // Highlight active navbar link
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
        }
    });

    // Login button (example)
    const loginBtn = document.querySelector(".btn-outline-danger");
    if (loginBtn) {
        loginBtn.addEventListener("click", function () {
            window.location.href = "/login";
        });
    }

});