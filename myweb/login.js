const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const loginData = { email, password };

    try {
        message.textContent = "Checking account...";
        message.className = "message";

        const response = await fetch("login.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Login failed.");
        }

        message.textContent = result.message;
        message.className = "message success";

        // Redirect to the dashboard (your index.html)
        setTimeout(function() {
            window.location.href = "index.html";
        }, 1000);

    } catch (error) {
        console.error(error);
        message.textContent = error.message;
        message.className = "message error";
    }
});