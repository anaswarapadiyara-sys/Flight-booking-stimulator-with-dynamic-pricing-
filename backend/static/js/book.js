// book.js
// ===========================
// TOGGLE ADD ADULT FORM
// // ===========================
// function toggleTravellerForm() {
//     const form = document.getElementById("collapseExample");
//     form.style.display = (form.style.display === "none") ? "block" : "none";
// }

// // make it visible to HTML onclick
// window.toggleTravellerForm = toggleTravellerForm;
console.log("BOOK JS LOADED");

function toggleTravellerForm() {
    const form = document.getElementById("collapseExample");
    if (!form) return;

    form.style.display =
        form.style.display === "none" || form.style.display === ""
            ? "block"
            : "none";
}
window.toggleTravellerForm = toggleTravellerForm;

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const flightId = params.get("flight_id");
    const departDate = params.get("date");
    const seatClass = params.get("class") || "Economy";

    if (!flightId || !departDate) {
        alert("Flight details missing.");
        return;
    }

    document.querySelector('input[name="flight1"]').value = flightId;
    document.querySelector('input[name="flight1Date"]').value = departDate;
    document.querySelector('input[name="flight1Class"]').value = seatClass;

    document.getElementById("seatClass").innerText = seatClass;

    fetchFlightFare(flightId);
    updatePassengerCount();
});

// ===========================
// FETCH FLIGHT + TICKET INFO
// ===========================
function fetchFlightFare(flightId) {
    fetch(`/flight/${flightId}`)
        .then(res => res.json())
        .then(flight => {
            // Fare
            document.getElementById("basefare").innerText = flight.price;
            document.getElementById("fee").innerText = 0;
            document.getElementById("totalfare").innerText = flight.price;

            // Ticket details
            document.getElementById("airlineName").innerText = flight.airline;
            document.getElementById("airlineName2").innerText = flight.airline;

            document.getElementById("flightNumber").innerText = flight.flight_number;
            document.getElementById("flightNumber2").innerText = flight.flight_number;

            document.getElementById("originCity").innerText = flight.origin;
            document.getElementById("destinationCity").innerText = flight.destination;

            const dep = new Date(flight.departure_time);
            const arr = new Date(flight.arrival_time);

            document.getElementById("departTime").innerText = dep.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            document.getElementById("arrivalTime").innerText = arr.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            document.getElementById("departDate").innerText = dep.toDateString();
            document.getElementById("arrivalDate").innerText = arr.toDateString();

            const duration = ((arr - dep) / (1000 * 60 * 60)).toFixed(2);
            document.getElementById("duration").innerText = duration + " hrs";
        })
        .catch(err => console.error("Error fetching flight:", err));
}

// ===========================
// ADD PASSENGER
// ===========================
function add_traveller() {
    const fname = document.getElementById("fname").value.trim();
    const lname = document.getElementById("lname").value.trim();
    const gender = document.querySelector('input[name="gender"]:checked')?.value;

    if (!fname || !lname || !gender) {
        alert("Please fill all passenger details.");
        return;
    }

    const countInput = document.getElementById("p-count");
    let count = parseInt(countInput.value) + 1;
    countInput.value = count;

    const div = document.createElement("div");
    div.className = "traveller-item";
    div.innerText = `${fname} ${lname} (${gender})`;

    document.querySelector(".each-traveller-div").appendChild(div);
    document.querySelector(".traveller-details h6 span").innerText = count;

    document.querySelector(".no-traveller").style.display = "none";

    document.getElementById("fname").value = "";
    document.getElementById("lname").value = "";
    document.querySelector('input[name="gender"]:checked').checked = false;
}

// ===========================
// TOGGLE ADD ADULT FORM
// ===========================
// function toggleTravellerForm() {
//     const form = document.getElementById("collapseExample");
//     form.style.display = form.style.display === "none" ? "block" : "none";
// }

// ===========================
// UPDATE COUNT
// ===========================
function updatePassengerCount() {
    const count = document.getElementById("p-count").value;
    document.querySelector(".traveller-details h6 span").innerText = count;
}

// ===========================
// BOOK FLIGHT
// ===========================
// function book_submit() {
//     const passengers = document.querySelectorAll(".traveller-item");

//     if (passengers.length === 0) {
//         alert("Please add at least one passenger.");
//         return false;
//     }

//     // Collect passenger names
//     const passengerNames = Array.from(passengers)
//         .map(p => p.innerText)
//         .join(", ");

//     const flightId = document.querySelector('input[name="flight1"]').value;

//     if (!flightId) {
//         alert("Flight ID missing.");
//         return false;
//     }

//     fetch(`/create-booking/${flightId}`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             seats: passengers.length,
//             passenger: passengerNames

//         })
//     })
//         .then(res => {
//             if (!res.ok) {
//                 return res.json().then(err => {
//                     throw new Error(err.detail || "Booking API failed");
//                 });
//             }
//             return res.json();
//         })
//         .then(data => {
//             console.log("Booking response:", data);
//             localStorage.setItem("pnr", data.pnr);
//             localStorage.setItem("amount", data.total_price);
//             localStorage.setItem("seats", data.seats);
//             localStorage.setItem("passenger", passengerNames);
//             console.log("PNR SAVED:", localStorage.getItem("pnr"));
//             console.log("AMOUNT SAVED:", localStorage.getItem("amount"));

//             alert(
//                 `Booking Confirmed!\nPNR: ${data.pnr}\nTotal Price: ₹${data.total_price}`
//             );

//             window.location.href = `/payment?pnr=${data.pnr}`;
//         })
//         .catch(err => {
//             console.error(err);
//             alert(err.message);
//         });

//     return false;
// }

// function book_submit() {
//     const passengers = document.querySelectorAll(".traveller-item");

//     if (passengers.length === 0) {
//         alert("Please add at least one passenger.");
//         return false;
//     }

//     const passengerNames = Array.from(passengers)
//         .map(p => p.innerText)
//         .join(", ");

//     const flightId = document.querySelector('input[name="flight1"]').value;
//     if (!flightId) {
//         alert("Flight ID missing.");
//         return false;
//     }

//     const email = document.getElementById("email")?.value.trim();
//     if (!email) {
//         alert("Please enter your email.");
//         return false;
//     }
//     console.log("Booking payload:", {
//         seats: passengers.length,
//         passenger: passengerNames,
//         email: email
//     });

//     fetch(`/create-booking/${flightId}`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             seats: passengers.length,
//             passenger: passengerNames,
//             email: email
//         })
//     })
//         .then(res => {
//             if (!res.ok) {
//                 return res.json().then(err => { throw new Error(err.detail || "Booking API failed"); });
//             }
//             return res.json();
//         })
//         .then(data => {
//             console.log("Booking response:", data);
//             localStorage.setItem("pnr", data.pnr);
//             localStorage.setItem("amount", data.total_price);
//             localStorage.setItem("seats", data.seats);
//             localStorage.setItem("passenger", passengerNames);

//             alert(`Booking Confirmed!\nPNR: ${data.pnr}\nTotal Price: ₹${data.total_price}`);
//             window.location.href = `/payment?pnr=${data.pnr}`;
//         })
//         .catch(err => {
//             console.error(err);
//             alert(err.message);
//         });

//     return false;
// }

function book_submit() {

    const passengers = document.querySelectorAll(".traveller-item");
    if (passengers.length === 0) {
        alert("Add at least one passenger");
        return false;
    }

    const passengerNames = Array.from(passengers)
        .map(p => p.innerText)
        .join(", ");

    const flightId = document.querySelector('input[name="flight1"]').value;
    if (!flightId) {
        alert("Flight ID missing");
        return false;
    }

    const emailInput = document.getElementById("email");
    if (!emailInput) {
        alert("Email input not found in HTML");
        return false;
    }

    const email = emailInput.value.trim();
    if (!email) {
        alert("Enter email");
        return false;
    }

    const payload = {
        seats: passengers.length,
        passenger: passengerNames,
        email: email
    };

    console.log("🚀 SENDING PAYLOAD:", payload);

    fetch(`/create-booking/${flightId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
        .then(async res => {
            const data = await res.json();
            if (!res.ok) {
                console.error("❌ BACKEND ERROR:", data);
                alert(JSON.stringify(data));
                return;
            }
            return data;
        })
        .then(data => {
            if (!data) return;

            alert(`Booking Confirmed\nPNR: ${data.pnr}`);
            window.location.href = `/payment?pnr=${data.pnr}`;
        })
        .catch(err => {
            console.error("❌ FETCH ERROR:", err);
            alert("Network error");
        });

    return false;
}
