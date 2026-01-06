document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector(".search-flight-form");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // =========================
        // GET INPUTS SAFELY
        // =========================
        const inputs = form.querySelectorAll("input");
        const selects = form.querySelectorAll("select");

        const tripType = form.querySelector('input[name="TripType"]:checked').value;

        const origin = inputs[2].value.trim();       // From
        const destination = inputs[3].value.trim();  // To
        const departDate = inputs[4].value;           // Departure Date
        const returnDate = inputs[5].value;           // Return Date (optional)
        const sortBy = selects[0].value;

        // =========================
        // VALIDATION
        // =========================
        if (!origin || !destination || !departDate) {
            alert("Please fill Origin, Destination and Departure Date");
            return;
        }

        // =========================
        // REDIRECT TO SEARCH UI
        // =========================
        let url = `/search?origin=${origin}&destination=${destination}&date=${departDate}&sort_by=${sortBy}&TripType=${tripType}`;

        if (tripType === "2" && returnDate) {
            url += `&returnDate=${returnDate}`;
        }

        window.location.href = url;
    });

});
