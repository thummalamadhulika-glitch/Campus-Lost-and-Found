const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
        loginMessage.textContent = "Please fill all the fields!";
        loginMessage.style.color = "red";
        return;
    }

    try {
        const response = await fetch(
            "https://campus-lost-and-found-dwqr.onrender.com/api/users/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            // Store login information
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            loginMessage.textContent = "Login successful!";
            loginMessage.style.color = "green";

            // Check user role
            const role = String(data.user.role || "")
                .trim()
                .toLowerCase();

            console.log("Logged-in user role:", role);

            // Redirect based on role
            if (role === "admin") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "dashboard.html";
            }

        } else {
            loginMessage.textContent =
                data.message || "Login failed!";

            loginMessage.style.color = "red";
        }

    } catch (error) {
        loginMessage.textContent =
            "Cannot connect to server. Please try again.";

        loginMessage.style.color = "red";
        console.log(error);
    }
});
