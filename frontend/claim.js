
const claimForm = document.getElementById("claimForm");
const claimMessage = document.getElementById("claimMessage");
const itemSelect = document.getElementById("itemId");

const token = localStorage.getItem("token");

// Check login
if (!token) {
    alert("Please login first!");
    window.location.href = "login.html";
}

// Load items from MongoDB
async function loadItems() {
    try {
        const response = await fetch(
            "https://campus-lost-and-found-dwqr.onrender.com/api/items"
        );

        const items = await response.json();

        itemSelect.innerHTML =
            '<option value="">Select an item</option>';

        items.forEach(function(item) {
            const option = document.createElement("option");

            option.value = item._id;
            option.textContent =
                item.itemName + " - " + item.type;

            itemSelect.appendChild(option);
        });

    } catch (error) {
        console.log(error);

        itemSelect.innerHTML =
            '<option value="">Unable to load items</option>';
    }
}

// Submit claim
claimForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const itemId = itemSelect.value;

    const description =
        document.getElementById("claimDescription").value +
        "\n" +
        document.getElementById("additionalDetails").value;

    try {
        const response = await fetch(
            "https://campus-lost-and-found-dwqr.onrender.com/api/claims",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    itemId: itemId,
                    description: description
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            claimMessage.textContent =
                "Claim submitted successfully!";

            claimMessage.style.color = "green";

            claimForm.reset();

        } else {
            claimMessage.textContent =
                data.message || "Unable to submit claim.";

            claimMessage.style.color = "red";
        }

    } catch (error) {
        console.log(error);

        claimMessage.textContent =
            "Cannot connect to server.";

        claimMessage.style.color = "red";
    }
});

// Load items when page opens
loadItems();
