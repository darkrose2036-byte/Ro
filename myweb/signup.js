const signupForm = document.getElementById("signupForm");
const message = document.getElementById("message");

signupForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        message.textContent = "❌ Passwords do not match.";
        message.className = "message error";
        return;
    }

   // Minimum password length

if (

    password.length < 6

) {

    message.textContent =

        "❌ Password must be at least 6 characters.";

    message.className =

        "message error";

    return;

}

    const user = { name, email, password };

    try {
        message.textContent = "Creating account...";
        message.className = "message";

        const response = await fetch("signup.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Could not create account.");
        }

        message.textContent = result.message;
        message.className = "message success";
        signupForm.reset();

        setTimeout(function() {
            window.location.href = "login.html";
        }, 1500);

    } catch (error) {
        console.error(error);
        message.textContent = error.message;
        message.className = "message error";
    }
});