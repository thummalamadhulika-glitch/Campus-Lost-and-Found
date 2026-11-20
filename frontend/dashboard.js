
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "null");

// Check login
if (!token || !user) {
    window.location.href = "login.html";
} else {

    // Display student name
    const nameElement = document.getElementById("studentName");
    nameElement.textContent = user.name;

    // Load dashboard information
    async function loadDashboard() {

        try {

            // Get student's reported items
            const itemResponse = await fetch(
                "https://campus-lost-and-found-dwqr.onrender.com/api/items/myitems",
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!itemResponse.ok) {
                throw new Error("Unable to load items");
            }

            const myItems = await itemResponse.json();

            // Update item counts
            document.getElementById("totalItems").textContent =
                myItems.length;

            document.getElementById("lostItems").textContent =
                myItems.filter(item => item.type === "Lost").length;

            document.getElementById("foundItems").textContent =
                myItems.filter(item => item.type === "Found").length;

            // Display reported items
            const myItemsContainer =
                document.getElementById("myItems");

            myItemsContainer.innerHTML = "";

            if (myItems.length === 0) {
                myItemsContainer.textContent =
                    "You haven't reported any items yet.";
            }

            myItems.forEach(function(item) {

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

                const status = document.createElement("p");
                status.textContent = "Status: " + item.status;

                card.appendChild(heading);
                card.appendChild(category);
                card.appendChild(location);
                card.appendChild(type);
                card.appendChild(status);

                myItemsContainer.appendChild(card);

            });

            // Get student's claims
            const claimResponse = await fetch(
                "https://campus-lost-and-found-dwqr.onrender.com/api/claims/myclaims",
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!claimResponse.ok) {
                throw new Error("Unable to load claims");
            }

            const claims = await claimResponse.json();

            // Update claim count
            document.getElementById("totalClaims").textContent =
                claims.length;

            // Display student's claims
            const myClaimsContainer =
                document.getElementById("myClaims");

            myClaimsContainer.innerHTML = "";

            if (claims.length === 0) {
                myClaimsContainer.textContent =
                    "You haven't submitted any claims yet.";
            }

            claims.forEach(function(claim) {

                const card = document.createElement("div");
                card.className = "item-card";

                const heading = document.createElement("h3");
                heading.textContent =
                    claim.item
                        ? claim.item.itemName
                        : "Unknown Item";

                const description = document.createElement("p");
                description.textContent =
                    "Description: " + claim.description;

                const status = document.createElement("p");
                status.textContent =
                    "Status: " + claim.status;

                card.appendChild(heading);
                card.appendChild(description);
                card.appendChild(status);

                myClaimsContainer.appendChild(card);

            });

        } catch (error) {

            console.log(error);
            alert("Unable to load dashboard information.");

        }
    }

    // Load dashboard
    loadDashboard();

}

// Logout
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";

});
