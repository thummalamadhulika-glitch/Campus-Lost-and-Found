
const reportForm = document.getElementById("reportForm");
const message = document.getElementById("message");

const token = localStorage.getItem("token");

// Check login
if (!token) {
    alert("Please login first!");
    window.location.href = "login.html";
}

// Get report type from URL
const params = new URLSearchParams(window.location.search);
const type = params.get("type");

if (type === "Lost" || type === "Found") {
    document.getElementById("itemType").value = type;
}

// Submit report
reportForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const formData = new FormData();

    formData.append(
        "type",
        document.getElementById("itemType").value
    );

    formData.append(
        "itemName",
        document.getElementById("itemName").value
    );

    formData.append(
        "category",
        document.getElementById("itemCategory").value
    );

    formData.append(
        "description",
        document.getElementById("description").value
    );

    formData.append(
        "location",
        document.getElementById("location").value
    );

    formData.append(
        "date",
        document.getElementById("itemDate").value
    );

    // Add image if selected
    const imageFile =
        document.getElementById("itemImage").files[0];

    if (imageFile) {
        formData.append("image", imageFile);
    }

    try {

        const response = await fetch(
            "http://localhost:5001/api/items",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            }
        );

        const data = await response.json();

        if (response.ok) {

            message.textContent =
                "Item reported successfully!";

            message.style.color = "green";

            reportForm.reset();

        } else {

            message.textContent =
                data.message || "Unable to report item.";

            message.style.color = "red";

        }

    } catch (error) {

        console.log(error);

        message.textContent =
            "Cannot connect to server. Please try again.";

        message.style.color = "red";

    }

});
