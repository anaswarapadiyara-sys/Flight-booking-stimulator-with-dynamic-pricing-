function loadHTML(id, file) {
    fetch(file)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Cannot load ${file}`);
            }
            return response.text();
        })
        .then(data => {
            const el = document.getElementById(id);
            if (el) {
                el.innerHTML = data;
            }
        })
        .catch(error => {
            console.error(error);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    loadHTML("head-placeholder", "/static/partials/head.html");
    loadHTML("navbar-placeholder", "/static/partials/navbar.html");
    loadHTML("footer-placeholder", "/static/partials/footer.html");
});