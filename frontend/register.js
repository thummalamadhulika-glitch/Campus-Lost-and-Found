
const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

registerForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Check passwords
    if (password !== confirmPassword) {
        registerMessage.textContent = "Passwords do not match!";
        registerMessage.style.color = "red";
        return;
    }

    try {
        const response = await fetch(
            "https://campus-lost-and-found-dwqr.onrender.com/api/users/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            registerMessage.textContent =
                "Registration successful! Please login.";

            registerMessage.style.color = "green";

            registerForm.reset();

        } else {
            registerMessage.textContent =
                data.message || "Registration failed!";

            registerMessage.style.color = "red";
        }

    } catch (error) {
        registerMessage.textContent =
            "Cannot connect to server. Please try again.";

        registerMessage.style.color = "red";
        console.log(error);
    }
});
