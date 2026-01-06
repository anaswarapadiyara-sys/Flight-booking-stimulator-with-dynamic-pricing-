// document.addEventListener("DOMContentLoaded", () => {

//     const pnr = localStorage.getItem("pnr");

//     if (!pnr) {
//         alert("PNR missing. Please book again.");
//         window.location.href = "/";
//         return;
//     }

//     const processingSection = document.querySelector(".section1");
//     const successSection = document.querySelector(".section2");
//     const errorSection = document.querySelector(".section3");

//     successSection.style.display = "none";
//     errorSection.style.display = "none";

//     setTimeout(() => {
//         fetch(`/pay/${pnr}`, { method: "POST" })
//             .then(res => res.json())
//             .then(data => {

//                 processingSection.style.display = "none";

//                 if (data.status === "Paid") {

//                     successSection.style.display = "block";


//                     document.querySelector(".ref").innerText = pnr;


//                     document.getElementById("ticketRef").value = pnr;


//                     fetch(`/booking/${pnr}`)
//                         .then(res => res.json())
//                         .then(booking =>
//                             fetch(`/flight/${booking.flight_id}`)
//                         )
//                         .then(res => res.json())
//                         .then(flight => {
//                             document.querySelector(".from1").innerText = flight.origin;
//                             document.querySelector(".to1").innerText = flight.destination;
//                         });

//                 } else {
//                     errorSection.style.display = "block";
//                 }
//             })
//             .catch(err => {
//                 console.error(err);
//                 processingSection.style.display = "none";
//                 errorSection.style.display = "block";
//             });

//     }, 2000);
// });
document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    const pnr = params.get("pnr") || localStorage.getItem("pnr");

    if (!pnr) {
        alert("PNR missing. Please book again.");
        window.location.href = "/";
        return;
    }

    const processingSection = document.querySelector(".section1");
    const successSection = document.querySelector(".section2");
    const errorSection = document.querySelector(".section3");

    successSection.style.display = "none";
    errorSection.style.display = "none";

    setTimeout(() => {
        fetch(`/pay/${pnr}`, { method: "POST" })
            .then(res => res.json())
            .then(data => {

                console.log("PAY RESPONSE:", data); // 🔥 DEBUG

                processingSection.style.display = "none";

                if (data.status === "Paid") {

                    successSection.style.display = "block";
                    document.querySelector(".ref").innerText = pnr;
                    document.getElementById("ticketRef").value = pnr;

                    fetch(`/booking/${pnr}`)
                        .then(res => res.json())
                        .then(booking =>
                            fetch(`/flight/${booking.flight_id}`)
                        )
                        .then(res => res.json())
                        .then(flight => {
                            document.querySelector(".from1").innerText = flight.origin;
                            document.querySelector(".to1").innerText = flight.destination;
                        });

                } else {
                    errorSection.style.display = "block";
                }
            })
            .catch(err => {
                console.error(err);
                processingSection.style.display = "none";
                errorSection.style.display = "block";
            });

    }, 2000);
});
