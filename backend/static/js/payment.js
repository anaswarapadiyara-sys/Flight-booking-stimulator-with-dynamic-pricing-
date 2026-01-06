document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const pnr = params.get("pnr");

    if (!pnr) {
        alert("PNR missing");
        return;
    }
    document.getElementById("display_pnr").innerText = pnr;
    // Fill hidden ticket refs
    document.getElementById("ticket1").value = pnr;
    document.getElementById("ticket2").value = ""; // one-way booking

    // Fetch booking details
    fetch(`/booking/${pnr}`)
        .then(res => {
            if (!res.ok) throw new Error("Booking not found");
            return res.json();
        })
        .then(data => {
            // Fill amount
            document.getElementById("payment_amount").value =
                `₹ ${data.total_price}`;

            // (Optional display)
            const pnrEl = document.getElementById("display_pnr");
            if (pnrEl) pnrEl.innerText = pnr;
        })
        .catch(err => {
            console.error(err);
            alert("Unable to load booking details");
        });
});
// CARD NUMBER FORMAT & VALIDATION
const cardInput = document.getElementById("card_number");

// Auto-format card number: 1234 5678 9012 3456
cardInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, ""); // remove non-digits
    value = value.substring(0, 16);                // max 16 digits
    value = value.replace(/(.{4})/g, "$1 ").trim();
    e.target.value = value;
});

// Validate card number before payment
function validateCardNumber() {
    const cardNumber = cardInput.value.replace(/\s+/g, "");

    if (cardNumber.length !== 16) {
        alert("Card number must be 16 digits");
        return false;
    }
    return true;
}
document.getElementById("card_number").addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");
    value = value.match(/.{1,4}/g)?.join(" ") || value;
    e.target.value = value;
});

function makePayment() {
    if (!validateCardNumber()) return;

    const pnr = localStorage.getItem("pnr");
    const amount = localStorage.getItem("amount");

    if (!pnr || !amount) {
        alert("Booking data missing. Please book again.");
        return;
    }

    const btn = document.getElementById("payment-btn");
    if (btn) btn.disabled = true;

    setTimeout(() => {
        window.location.href = "/paymentprocess";
    }, 1500);
}