// console.log("BOOK JS LOADED");
// let popupEl;
// let cancelBtnPopup;


// document.addEventListener("DOMContentLoaded", () => {
//     const container = document.querySelector(".container");
//     const emptyState = document.querySelector(".empty-state");
//     popupEl = document.querySelector(".popup");

//     cancelBtnPopup = document.getElementById("cancel_ticket_btn");

//     // Fetch all bookings
//     async function fetchBookings() {
//         try {
//             const res = await fetch("/bookings");
//             const bookings = await res.json();

//             // Clear old bookings
//             const oldBookings = document.querySelectorAll(".each-booking-div");
//             oldBookings.forEach(b => b.remove());

//             if (bookings.length === 0) {
//                 emptyState.style.display = "block";
//                 return;
//             } else {
//                 emptyState.style.display = "none";
//             }

//             bookings.forEach(b => {
//                 const bookingDiv = createBookingDiv(b);
//                 container.insertBefore(bookingDiv, emptyState);
//             });
//         } catch (err) {
//             console.error("Error fetching bookings:", err);
//         }
//     }

//     // Create a booking HTML element
//     function createBookingDiv(b) {
//         const div = document.createElement("div");
//         div.className = "row each-booking-div";
//         div.id = b.pnr;

//         // Format booked_at date
//         const bookedDate = new Date(b.booked_at);
//         const day = bookedDate.getDate();
//         const monthShort = bookedDate.toLocaleString("default", { month: "short" });
//         const yearShort = String(bookedDate.getFullYear()).slice(2);
//         const weekday = bookedDate.toLocaleString("default", { weekday: "short" });

//         div.innerHTML = `
//             <div class="col-2" style="display: flex;">
//                 <div style="display: flex; color: #666666; margin-top: auto;">
//                     <div><span style="font-size: 2.1em;">${day}</span></div>
//                     <div style="font-size: smaller; display: flex; margin: auto 0; padding-left: 5px; line-height: 1em;">
//                         <div style="margin: auto;">
//                             <div>${weekday}</div>
//                             <div>${monthShort}'${yearShort}</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div class="col-4 middle-div">
//                 <div style="width:100%">
//                     <div class="row places-div">
//                         <div style="max-width: 45%;">Origin City</div>
//                         <div>&nbsp;-&nbsp;</div>
//                         <div style="max-width: 45%;">Destination City</div>
//                     </div>
//                     <div class="row places-div" style="font-size: .8em; color: #999999;">
//                         Airline · Plane · ${b.seats} Passenger(s)
//                     </div>
//                 </div>
//             </div>

//             <div class="col-2 middle-div">
//                 <div style="font-size: 1.2em; color: #945937;">${b.pnr}</div>
//             </div>

//             <div class="col-2 middle-div">
//                 <div>
//                     <div class="row status-div">
//                         <div class="${getStatusClass(b.status)}">${b.status.toUpperCase()}</div>
//                     </div>
//                     <div class="row booking-date-div" style="font-size: .7em; color: #666;">
//                         Booked on: ${bookedDate.toDateString()}
//                     </div>
//                 </div>
//             </div>

//             <div class="col-2 last-div">
//                 <div class="ticket-action-div">
//                     <form action="/getticket" method="get" target="_blank">
//                         <input type="hidden" name="ref" value="${b.pnr}">
//                         <button type="submit" class="btn btn-outline-info btnp pbtn">🖨️</button>
//                     </form>

//                     <button class="btn btn-outline-danger btnp cbtn"
//                             data-ref="${b.pnr}"
//                             onclick="popup(this)">
//                         Cancel
//                     </button>
//                 </div>
//             </div>
//         `;
//         return div;
//     }

//     // Status color helper
//     function getStatusClass(status) {
//         if (status.toLowerCase() === "confirmed" || status.toLowerCase() === "paid") return "green";
//         if (status.toLowerCase() === "pending") return "orange";
//         if (status.toLowerCase() === "cancelled") return "red";
//         return "";
//     }



//     // Initial fetch
//     fetchBookings();

//     // Optional: refresh bookings every 30 seconds
//     setInterval(fetchBookings, 30000);
// });

// // Show cancel popup
// window.popup = function (btn) {
//     const ref = btn.getAttribute("data-ref");
//     cancelBtnPopup.setAttribute("data-ref", ref);
//     popupEl.style.display = "flex";

// };

// // Hide cancel popup
// window.remove_popup = function () {
//     popupEl.style.display = "none";

// };

// // Cancel booking
// window.cancel_tkt = async function () {
//     const ref = cancelBtnPopup.getAttribute("data-ref");
//     try {
//         const res = await fetch(`/cancel/${ref}`, { method: "DELETE" });
//         const data = await res.json();
//         alert(data.message);
//         remove_popup();
//         fetchBookings();
//     } catch (err) {
//         console.error("Error cancelling booking:", err);
//     }
// };

// console.log("BOOK JS LOADED");

// document.addEventListener("DOMContentLoaded", () => {

//     const container = document.querySelector(".container");
//     const emptyState = document.querySelector(".empty-state");
//     const popupEl = document.querySelector(".popup");
//     const cancelBtnPopup = document.getElementById("cancel_ticket_btn");
//     const goBackBtn = document.getElementById("popup_go_back");

//     // Fetch bookings from backend
//     async function fetchBookings() {
//         try {
//             const res = await fetch("/bookings");
//             const bookings = await res.json();

//             // Clear old rows
//             document.querySelectorAll(".each-booking-div").forEach(div => div.remove());

//             if (!bookings.length) {
//                 emptyState.style.display = "block";
//                 return;
//             } else {
//                 emptyState.style.display = "none";
//             }

//             // Create a row for each booking
//             bookings.forEach(b => {
//                 const div = createBookingDiv(b);
//                 container.insertBefore(div, emptyState);

//                 // Add click listener for the row Cancel button
//                 const cancelBtn = div.querySelector(".cbtn");
//                 cancelBtn.addEventListener("click", () => {
//                     popupEl.style.display = "flex";
//                     cancelBtnPopup.setAttribute("data-ref", b.pnr);
//                 });
//             });

//         } catch (err) {
//             console.error("Error fetching bookings:", err);
//         }
//     }

//     // Go back button hides popup
//     goBackBtn.addEventListener("click", () => {
//         popupEl.style.display = "none";
//     });

//     // Popup Cancel button calls API
//     cancelBtnPopup.addEventListener("click", async () => {
//         const ref = cancelBtnPopup.getAttribute("data-ref");
//         try {
//             const res = await fetch(`/cancel/${ref}`, { method: "DELETE" });
//             const data = await res.json();
//             alert(data.message);
//             popupEl.style.display = "none";
//             fetchBookings(); // Refresh the bookings list
//         } catch (err) {
//             console.error("Error cancelling booking:", err);
//         }
//     });

//     // Create booking row
//     function createBookingDiv(b) {
//         const bookedDate = new Date(b.booked_at);
//         const day = bookedDate.getDate();
//         const monthShort = bookedDate.toLocaleString("default", { month: "short" });
//         const yearShort = String(bookedDate.getFullYear()).slice(2);
//         const weekday = bookedDate.toLocaleString("default", { weekday: "short" });

//         const div = document.createElement("div");
//         div.className = "row each-booking-div";

//         div.innerHTML = `
//             <div class="col-2" style="display: flex;">
//                 <div style="display: flex; color: #666; margin-top: auto;">
//                     <div><span style="font-size: 2.1em;">${day}</span></div>
//                     <div style="font-size: smaller; display: flex; margin: auto 0; padding-left: 5px; line-height: 1em;">
//                         <div style="margin: auto;">
//                             <div>${weekday}</div>
//                             <div>${monthShort}'${yearShort}</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div class="col-4 middle-div">
//                 <div style="width:100%">
//                     <div class="row places-div">
//                         <div style="max-width: 45%;">Origin City</div>
//                         <div>&nbsp;-&nbsp;</div>
//                         <div style="max-width: 45%;">Destination City</div>
//                     </div>
//                     <div class="row places-div" style="font-size: .8em; color: #999;">
//                         Airline · Plane · ${b.seats} Passenger(s)
//                     </div>
//                 </div>
//             </div>
//             <div class="col-2 middle-div">
//                 <div style="font-size: 1.2em; color: #945937;">${b.pnr}</div>
//             </div>
//             <div class="col-2 middle-div">
//                 <div>
//                     <div class="row status-div">
//                         <div class="${getStatusClass(b.status)}">${b.status.toUpperCase()}</div>
//                     </div>
//                     <div class="row booking-date-div" style="font-size: .7em; color: #666;">
//                         Booked on: ${bookedDate.toDateString()}
//                     </div>
//                 </div>
//             </div>
//             <div class="col-2 last-div">
//                 <div class="ticket-action-div">
//                     <form action="/getticket" method="get" target="_blank">
//                         <input type="hidden" name="ref" value="${b.pnr}">
//                         <button type="submit" class="btn btn-outline-info btnp pbtn">🖨️</button>
//                     </form>
//                     <button class="btn btn-outline-danger btnp cbtn" data-ref="${b.pnr}">
//                         Cancel
//                     </button>
//                 </div>
//             </div>
//         `;

//         return div;
//     }

//     // Status color helper
//     function getStatusClass(status) {
//         if (status.toLowerCase() === "confirmed" || status.toLowerCase() === "paid") return "green";
//         if (status.toLowerCase() === "pending") return "orange";
//         if (status.toLowerCase() === "cancelled") return "red";
//         return "";
//     }

//     // Initial fetch
//     fetchBookings();
// });



// document.addEventListener("DOMContentLoaded", () => {
//     loadBookings();
//     setupPopupListeners();
// });

// // Main function to fetch and display bookings
// async function loadBookings() {
//     const container = document.querySelector(".container");
//     const emptyState = document.querySelector(".empty-state");

//     try {
//         // 1. Fetch both Flights and Bookings in parallel
//         // (We need flights to show Origin/Dest names, as /bookings only gives flight_id)
//         const [flightsRes, bookingsRes] = await Promise.all([
//             fetch("/flights"),
//             fetch("/bookings")
//         ]);

//         if (!flightsRes.ok || !bookingsRes.ok) {
//             throw new Error("Failed to fetch data");
//         }

//         const flights = await flightsRes.json();
//         const bookings = await bookingsRes.json();

//         // 2. Create a lookup map for flights (ID -> Flight Data) for faster access
//         const flightMap = {};
//         flights.forEach(f => {
//             flightMap[f.flight_id] = f;
//         });

//         // 3. Clear current list (except empty state div)
//         // We remove any previously generated cards to avoid duplicates on reload
//         const existingCards = document.querySelectorAll(".booking-card");
//         existingCards.forEach(card => card.remove());

//         // 4. Handle Empty State
//         if (bookings.length === 0) {
//             emptyState.style.display = "block";
//             return;
//         } else {
//             emptyState.style.display = "none";
//         }

//         // 5. Render Cards
//         // We reverse the array to show the newest bookings first
//         bookings.reverse().forEach(booking => {
//             const flight = flightMap[booking.flight_id];

//             // Generate the HTML card
//             const card = createBookingCard(booking, flight);

//             // Append after the empty state div (preserving the container structure)
//             container.appendChild(card);
//         });

//     } catch (error) {
//         console.error("Error loading bookings:", error);
//         container.innerHTML += `<p style="text-align:center; color:red;">Error loading bookings. Please try again later.</p>`;
//     }
// }

// // Helper to generate the HTML for a single booking card
// function createBookingCard(booking, flight) {
//     const card = document.createElement("div");
//     card.className = "booking-card";
//     card.id = `card-${booking.pnr}`; // ID for easy removal later

//     // Determine Status Colors
//     let statusClass = "status-confirmed"; // default
//     if (booking.status === "Paid") statusClass = "status-paid";
//     if (booking.status === "Cancelled") statusClass = "status-cancelled";

//     // Format Dates
//     const depTime = flight ? new Date(flight.departure_time).toLocaleString() : "N/A";

//     // Determine Buttons based on Status
//     let actionButtons = "";

//     // Only show Cancel if not already cancelled
//     if (booking.status !== "Cancelled") {
//         actionButtons += `
//             <button class="btn btn-danger" onclick="openCancelPopup('${booking.pnr}')">
//                 Cancel Booking
//             </button>
//         `;
//     }

//     // Show Pay button if Confirmed but not Paid
//     if (booking.status === "Confirmed") {
//         actionButtons += `
//             <button class="btn btn-primary" onclick="payNow('${booking.pnr}')" style="margin-left: 10px;">
//                 Pay Now
//             </button>
//         `;
//     }

//     // Show Download Ticket if Paid
//     if (booking.status === "Paid") {
//         actionButtons += `
//             <a href="/ticket-pdf/${booking.pnr}" target="_blank" class="btn btn-success" style="margin-left: 10px;">
//                 Download Ticket
//             </a>
//         `;
//     }

//     card.innerHTML = `
//         <div class="card-header">
//             <div class="route">
//                 <span class="city">${flight ? flight.origin : "Unknown"}</span>
//                 <span class="arrow">➝</span>
//                 <span class="city">${flight ? flight.destination : "Unknown"}</span>
//             </div>
//             <span class="pnr-badge">PNR: ${booking.pnr}</span>
//         </div>

//         <div class="card-body">
//             <div class="info-group">
//                 <label>Flight No</label>
//                 <span>${flight ? flight.flight_number : "N/A"}</span>
//             </div>
//             <div class="info-group">
//                 <label>Date & Time</label>
//                 <span>${depTime}</span>
//             </div>
//             <div class="info-group">
//                 <label>Passenger</label>
//                 <span>${booking.passenger}</span>
//             </div>
//             <div class="info-group">
//                 <label>Seats</label>
//                 <span>${booking.seats}</span>
//             </div>
//             <div class="info-group">
//                 <label>Total Price</label>
//                 <span class="price">₹${booking.total_price}</span>
//             </div>
//              <div class="info-group">
//                 <label>Status</label>
//                 <span class="status-badge ${statusClass}">${booking.status}</span>
//             </div>
//         </div>

//         <div class="card-footer">
//             ${actionButtons}
//         </div>
//     `;

//     return card;
// }

// // --- Popup Logic ---

// function setupPopupListeners() {
//     const popup = document.querySelector(".popup");
//     const goBackBtn = document.getElementById("popup_go_back");
//     const confirmCancelBtn = document.getElementById("cancel_ticket_btn");

//     // Close popup
//     goBackBtn.addEventListener("click", () => {
//         popup.style.display = "none";
//     });

//     // Handle the actual cancellation
//     confirmCancelBtn.addEventListener("click", async () => {
//         const pnr = confirmCancelBtn.getAttribute("data-ref");

//         if (!pnr) return;

//         confirmCancelBtn.innerText = "Cancelling...";
//         confirmCancelBtn.disabled = true;

//         try {
//             const response = await fetch(`/cancel/${pnr}`, {
//                 method: "DELETE"
//             });

//             const result = await response.json();

//             if (response.ok) {
//                 // Success: Update UI
//                 alert(result.message);
//                 popup.style.display = "none";

//                 // Reload bookings to reflect status change
//                 loadBookings();
//             } else {
//                 alert("Error: " + (result.detail || "Could not cancel booking"));
//             }

//         } catch (err) {
//             console.error(err);
//             alert("Network error. Please try again.");
//         } finally {
//             confirmCancelBtn.innerText = "Cancel";
//             confirmCancelBtn.disabled = false;
//         }
//     });
// }

// // Triggered by the "Cancel" button on the card
// window.openCancelPopup = function (pnr) {
//     const popup = document.querySelector(".popup");
//     const confirmBtn = document.getElementById("cancel_ticket_btn");

//     // Store the PNR in the confirm button so we know what to cancel later
//     confirmBtn.setAttribute("data-ref", pnr);

//     popup.style.display = "flex";
// };

// // Triggered by the "Pay Now" button
// window.payNow = async function (pnr) {
//     if (!confirm("Proceed to payment simulation?")) return;

//     try {
//         const res = await fetch(`/pay/${pnr}`, { method: "POST" });
//         const data = await res.json();

//         if (res.ok) {
//             alert("Payment Successful! Ticket has been emailed.");
//             loadBookings(); // Refresh UI
//         } else {
//             alert("Payment Failed: " + data.detail);
//         }
//     } catch (e) {
//         alert("Error processing payment");
//     }
// };

document.addEventListener("DOMContentLoaded", () => {
    loadBookings();
    setupPopupListeners();
});

async function loadBookings() {
    const container = document.querySelector(".container");
    const emptyState = document.querySelector(".empty-state");

    try {
        const [flightsRes, bookingsRes] = await Promise.all([
            fetch("/flights"),
            fetch("/bookings")
        ]);

        const flights = await flightsRes.json();
        const bookings = await bookingsRes.json();
        const flightMap = {};
        flights.forEach(f => flightMap[f.flight_id] = f);

        document.querySelectorAll(".booking-card").forEach(c => c.remove());

        if (bookings.length === 0) {
            emptyState.style.display = "block";
            return;
        } else {
            emptyState.style.display = "none";
        }

        bookings.reverse().forEach(booking => {
            const flight = flightMap[booking.flight_id];
            const card = createBookingCard(booking, flight);
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Load error:", error);
    }
}

function createBookingCard(booking, flight) {
    console.log("This is what JS sees:", booking);
    const card = document.createElement("div");
    card.className = "booking-card";

    let statusClass = "status-confirmed";
    if (booking.status === "Paid") statusClass = "status-paid";
    if (booking.status === "Cancelled") statusClass = "status-cancelled";

    let actionButtons = "";
    if (booking.status !== "Cancelled") {
        actionButtons += `<button class="btn btn-danger" onclick="window.openCancelPopup('${booking.pnr}')">Cancel</button>`;
    }
    if (booking.status === "Confirmed") {
        actionButtons += `<button class="btn btn-primary" onclick="window.payNow('${booking.pnr}')" style="margin-left:10px;">Pay Now</button>`;
    }

    // UPDATED HERE: Added seat_count and total_price to the card
    card.innerHTML = `
        <div class="card-header">
            <strong>PNR: ${booking.pnr}</strong>
            <span class="status-badge ${statusClass}">${booking.status}</span>
        </div>
        <div class="card-body">
            <div class="info-group">
                <label>Route</label>
                <span>${flight ? flight.origin : 'N/A'} ➝ ${flight ? flight.destination : 'N/A'}</span>
            </div>
            <div class="info-group">
                <label>Seats</label>
                <span>${booking.seats} Seats</span>
            </div>
            <div class="info-group">
                <label>Price</label>
                <span class="price">₹${booking.total_price}</span>
            </div>
        </div>
        <div class="card-footer">${actionButtons}</div>
    `;
    return card;
}

function setupPopupListeners() {
    const popup = document.querySelector(".popup");
    const goBackBtn = document.getElementById("popup_go_back");
    const confirmBtn = document.getElementById("cancel_ticket_btn");

    if (goBackBtn) goBackBtn.addEventListener("click", () => popup.style.display = "none");

    if (confirmBtn) {
        confirmBtn.addEventListener("click", async () => {
            const pnr = confirmBtn.getAttribute("data-ref");
            try {
                const res = await fetch(`/cancel/${pnr}`, { method: "DELETE" });
                if (res.ok) {
                    alert("Ticket Cancelled Successfully!");
                    popup.style.display = "none";
                    loadBookings();
                } else {
                    const err = await res.json();
                    alert("Error: " + err.detail);
                }
            } catch (e) {
                alert("Could not connect to server");
            }
        });
    }
}

window.openCancelPopup = function (pnr) {
    const popup = document.querySelector(".popup");
    const confirmBtn = document.getElementById("cancel_ticket_btn");
    if (popup && confirmBtn) {
        confirmBtn.setAttribute("data-ref", pnr);
        popup.style.display = "flex";
    }
};

window.payNow = async function (pnr) {
    if (!confirm("Confirm payment for PNR: " + pnr + "?")) return;
    try {
        const res = await fetch(`/pay/${pnr}`, { method: "POST" });
        if (res.ok) {
            alert("Paid Successfully!");
            loadBookings();
        }
    } catch (e) {
        alert("Payment failed. Try again.");
    }
};