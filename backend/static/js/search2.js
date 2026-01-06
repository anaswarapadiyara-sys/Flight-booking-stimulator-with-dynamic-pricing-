document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);

    const origin = params.get("origin");
    const destination = params.get("destination");
    const departDate = params.get("date");
    const returnDate = params.get("returnDate");
    const tripType = params.get("TripType") || "1";
    const seatClass = params.get("class") || "Economy";

    if (!origin || !destination || !departDate) {
        alert("Missing search details");
        return;
    }

    // ============================
    // UPDATE UI
    // ============================
    document.getElementById("from-city").innerText = origin;
    document.getElementById("from-code").innerText = origin;
    document.getElementById("to-city").innerText = destination;
    document.getElementById("to-code").innerText = destination;
    document.getElementById("seat-class").innerText = seatClass;

    document.getElementById("depart-date").innerText =
        new Date(departDate).toDateString();

    if (tripType === "2" && returnDate) {
        document.getElementById("return-date").innerText =
            new Date(returnDate).toDateString();
    }

    // ============================
    // FETCH DEPARTURE FLIGHTS
    // ============================
    fetchFlights(origin, destination, departDate, "departure-flights");

    // ============================
    // FETCH RETURN FLIGHTS (ROUND TRIP)
    // ============================
    if (tripType === "2" && returnDate) {
        fetchFlights(destination, origin, returnDate, "return-flights");
    }
    // ============================
    // FETCH FARE HISTORY
    // ============================
    // fetchFareHistory(origin, destination);

    console.log("Origin:", origin);
    console.log("Destination:", destination);
    console.log("Depart Date:", departDate);

});

// ============================
// FETCH FLIGHTS
// ============================

let allFlights = [];

function fetchFlights(origin, destination, date, containerId) {
    fetch(`/api/search?origin=${origin}&destination=${destination}&date=${date}`)
        .then(res => {
            if (!res.ok) throw new Error("No flights found");
            return res.json();
        })
        .then(data => {
            console.log("Flights fetched:", data);
            allFlights = data;
            renderFlights(data, containerId);
        })
        .catch(() => {
            document.getElementById(containerId).innerHTML =
                "<p>No flights available</p>";
        });
}


// ============================
// RENDER FLIGHTS (CORRECTED)
// ============================
function renderFlights(flights, containerId) {
    const container = document.getElementById(containerId);

    // Safety Check: Ensure the container exists in your HTML
    if (!container) {
        console.error("Container not found:", containerId);
        return;
    }

    container.innerHTML = "";

    if (!flights || flights.length === 0) {
        container.innerHTML = "<p>No flights available for this date.</p>";
        return;
    }

    flights.forEach(f => {
        const card = document.createElement("div");
        card.className = "flight-card";

        // MISTAKE FIX: Added safety checks for duration and price
        // This prevents the "toFixed" crash if duration is missing
        const durationDisplay = (f.duration && typeof f.duration === 'number')
            ? f.duration.toFixed(2)
            : "N/A";

        const priceDisplay = f.price || "N/A";

        card.innerHTML = `
            <p><strong>${f.flight_number}</strong> | ${f.origin} → ${f.destination}</p>
            <p>Departure: ${formatTime(f.departure_time)} | Arrival: ${formatTime(f.arrival_time)}</p>
            <p>Duration: ${durationDisplay} hrs | Seats: ${f.available_seats}</p>
            <p>Price: ₹${priceDisplay}</p>
            
            <button onclick="fetchFareHistory(${f.flight_id})">
                View Fare History
            </button>         
            <button onclick="selectFlight(${f.flight_id}, '${f.departure_time}')">
               Select
            </button>
        `;

        container.appendChild(card);
    });
}


function filterByPrice(maxPrice) {
    document.getElementById("max-price").innerText = maxPrice;

    const filtered = allFlights.filter(f => f.price <= maxPrice);

    renderFlights(filtered, "departure-flights");
}

// ============================
// BOOK FLIGHT
// ============================
// function bookFlight(flightId) {
//     fetch(`/create-booking/${flightId}?seats=1&passenger=Guest`, {
//         method: "POST"
//     })
//         .then(res => res.json())
//         .then(data => {
//             alert(`PNR: ${data.pnr}\nTotal: ₹${data.total_price}`);
//         });
// }
// function bookFlight(flightId) {
//     const params = new URLSearchParams(window.location.search);
//     const date = params.get("date");
//     const seatClass = params.get("class") || "Economy";

//     if (!date) {
//         alert("Date missing");
//         return;
//     }

//     window.location.href =
//         `/book?flight_id=${flightId}&date=${date}&class=${seatClass}`;
// }

function selectFlight(flightId, departureTime) {
    const date = departureTime.split("T")[0];

    window.location.href =
        `/book?flight_id=${flightId}&date=${date}&class=Economy`;
}


// ============================
// FORMAT TIME
// ============================
function formatTime(dateString) {
    const d = new Date(dateString);
    return d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}
// ============================
// FETCH FARE HISTORY FROM BACKEND
// ============================
function fetchFareHistory(flightId) {
    fetch(`/fare-history/${flightId}`)
        .then(res => res.json())
        .then(data => renderFareHistory(data))
        .catch(err => console.error("Fare history error:", err));
}


// ============================
// RENDER FARE HISTORY IN UI
// ============================
function renderFareHistory(data) {
    if (!Array.isArray(data) || data.length === 0) {
        document.getElementById("fare-history").style.display = "block";
        document.getElementById("lowest-fare").innerText = "Lowest: N/A";
        document.getElementById("highest-fare").innerText = "Highest: N/A";
        document.getElementById("average-fare").innerText = "Average: N/A";
        return;
    }

    document.getElementById("fare-history").style.display = "block";

    let fares = data.map(f => f.new_fare);
    let lowest = Math.min(...fares);
    let highest = Math.max(...fares);
    let average = (fares.reduce((a, b) => a + b, 0) / fares.length).toFixed(2);

    document.getElementById("lowest-fare").innerText = "Lowest: ₹" + lowest;
    document.getElementById("highest-fare").innerText = "Highest: ₹" + highest;
    document.getElementById("average-fare").innerText = "Average: ₹" + average;
}
