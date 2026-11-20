const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "null");

const role = String(user?.role || "").trim().toLowerCase();

console.log("Admin page role:", role);

if (!token || !user || role !== "admin") {
    alert("Admin access only! Please login as admin.");
    window.location.href = "login.html";
}

// Load admin dashboard
async function loadAdminDashboard() {
    try {
        // Get all reported items
        const itemResponse = await fetch(
            "http://localhost:5001/api/items"
        );

        const items = await itemResponse.json();

        // Get all student claims
        const claimResponse = await fetch(
            "http://localhost:5001/api/claims",
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const claims = await claimResponse.json();

        if (!itemResponse.ok || !claimResponse.ok) {
            throw new Error("Unable to load admin data");
        }

        // Update statistics
        document.getElementById("totalItems").textContent =
            items.length;

        document.getElementById("lostItems").textContent =
            items.filter(item => item.type === "Lost").length;

        document.getElementById("foundItems").textContent =
            items.filter(item => item.type === "Found").length;

        document.getElementById("totalClaims").textContent =
            claims.length;

        // Display reported items
        const itemList =
            document.getElementById("adminItemList");

        itemList.innerHTML = "";

        items.forEach(function(item) {
            const card = document.createElement("div");
            card.className = "item-card";

            const heading = document.createElement("h3");
            heading.textContent = item.itemName;

            const category = document.createElement("p");
            category.textContent = "Category: " + item.category;

            const location = document.createElement("p");
            location.textContent = "Location: " + item.location;

            const type = document.createElement("p");
            type.textContent = "Type: " + item.type;

            card.appendChild(heading);
            card.appendChild(category);
            card.appendChild(location);
            card.appendChild(type);

            itemList.appendChild(card);
        });

        // Display student claims
        const claimList =
            document.getElementById("adminClaimList");

        claimList.innerHTML = "";

        if (claims.length === 0) {
            claimList.textContent = "No claims submitted yet.";
        }

        claims.forEach(function(claim) {
            const card = document.createElement("div");
            card.className = "item-card";

            const heading = document.createElement("h3");
            heading.textContent =
                claim.item ? claim.item.itemName : "Unknown Item";

            const student = document.createElement("p");
            student.textContent =
                "Student: " +
                (claim.student ? claim.student.name : "Unknown");

            const description = document.createElement("p");
            description.textContent =
                "Description: " + claim.description;

            const status = document.createElement("p");
            status.textContent = "Status: " + claim.status;

            const approveButton = document.createElement("button");
            approveButton.textContent = "Approve";

            approveButton.addEventListener("click", function() {
                updateClaim(claim._id, "Approved");
            });

            const rejectButton = document.createElement("button");
            rejectButton.textContent = "Reject";

            rejectButton.addEventListener("click", function() {
                updateClaim(claim._id, "Rejected");
            });

            card.appendChild(heading);
            card.appendChild(student);
            card.appendChild(description);
            card.appendChild(status);
            card.appendChild(approveButton);
            card.appendChild(rejectButton);

            claimList.appendChild(card);
        });

    } catch (error) {
        console.log(error);
        alert("Unable to load admin dashboard.");
    }
}

// Approve or reject a claim
async function updateClaim(claimId, newStatus) {
    try {
        const response = await fetch(
            "http://localhost:5001/api/claims/" + claimId,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: newStatus
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            alert("Claim " + newStatus + " successfully!");
            loadAdminDashboard();
        } else {
            alert(data.message || "Unable to update claim.");
        }

    } catch (error) {
        console.log(error);
        alert("Cannot connect to server.");
    }
}

// Logout
const logoutLink = document.querySelector('nav a[href="login.html"]');

if (logoutLink) {
    logoutLink.addEventListener("click", function() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    });
}

// Load dashboard
if (token && user && role === "admin") {
    loadAdminDashboard();
}
