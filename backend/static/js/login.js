document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("signin-form");
    const usernameInput = document.querySelector(".usrnm");
    const passwordInput = document.querySelector(".pswd");
    const submitBtn = document.querySelector("input[type='submit']");
    const errorMessage = document.getElementById("error-message");

    // 1. Enable/Disable button based on input
    const toggleButton = () => {
        if (usernameInput.value.trim() !== "" && passwordInput.value.trim() !== "") {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    };

    usernameInput.addEventListener("input", toggleButton);
    passwordInput.addEventListener("input", toggleButton);

    // 2. Handle Form Submission
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        errorMessage.innerText = "Checking...";
        errorMessage.style.color = "blue";

        const formData = new FormData();
        formData.append("username", usernameInput.value);
        formData.append("password", passwordInput.value);

        try {
            const response = await fetch("/login", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                // SUCCESS CHANGES START HERE
                errorMessage.innerText = "Success!";
                errorMessage.style.color = "green";

                // 1. Save to localStorage
                localStorage.setItem("user", usernameInput.value);

                // 2. Show the Popup Alert
                alert("✅ Login Successful! Welcome back, " + usernameInput.value);

                // 3. Redirect immediately after clicking 'OK' on the alert
                window.location.href = data.redirect || "/search";

            } else {
                // ERROR HANDLING
                errorMessage.innerText = data.message || "Invalid username or password";
                errorMessage.style.color = "red";
            }
        } catch (error) {
            console.error("Fetch error:", error);
            errorMessage.innerText = "Server error. Try again later.";
            errorMessage.style.color = "red";
        }
    });
});