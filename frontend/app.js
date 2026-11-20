
// Store items received from MongoDB
let items = [];

// Backend URL
const backendURL = "https://campus-lost-and-found-dwqr.onrender.com";

// Function to display items
function displayItems(data) {

    const itemList = document.getElementById("itemList");

    itemList.innerHTML = "";

    if (data.length === 0) {

        itemList.textContent = "No items found.";

        return;
    }

    data.forEach(function(item) {

        const card = document.createElement("div");

        card.className = "item-card";

        // Display item image
        if (item.image) {

            const image = document.createElement("img");

            image.src = backendURL + item.image;

            image.alt = item.itemName;

            image.style.width = "100%";
            image.style.maxWidth = "250px";
            image.style.height = "180px";
            image.style.objectFit = "cover";
            image.style.borderRadius = "10px";

            card.appendChild(image);
        }

        // Item name
        const heading = document.createElement("h3");

        heading.textContent = item.itemName;

        // Category
        const category = document.createElement("p");

        category.textContent = "Category: " + item.category;

        // Location
        const location = document.createElement("p");

        location.textContent = "Location: " + item.location;

        // Lost or Found
        const type = document.createElement("p");

        type.textContent = "Type: " + item.type;

        // Date
        const date = document.createElement("p");

        const formattedDate = new Date(item.date)
    .toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

date.textContent = "Date: " + formattedDate;
        // Add details to card
        card.appendChild(heading);
        card.appendChild(category);
        card.appendChild(location);
        card.appendChild(type);
        card.appendChild(date);

        itemList.appendChild(card);

    });

}

// Function to load items from MongoDB
async function loadItems() {

    try {

        const response = await fetch(
            backendURL + "/api/items"
        );

        if (!response.ok) {

            throw new Error("Unable to load items");

        }

        items = await response.json();

        // Apply default sorting and filters
        filterItems();

    } catch (error) {

        console.log(error);

        document.getElementById("itemList").textContent =
            "Unable to load items. Please try again later.";

    }

}

// Function to search, filter and sort items
function filterItems() {

    const search = document
        .getElementById("searchInput")
        .value.toLowerCase();

    const category =
        document.getElementById("categoryFilter").value;

    const type =
        document.getElementById("typeFilter").value;

    const sort =
        document.getElementById("dateSort").value;

    // Filter items
    let filteredItems = items.filter(function(item) {

        return (

            item.itemName.toLowerCase().includes(search) &&

            (category === "" || item.category === category) &&

            (type === "" || item.type === type)

        );

    });

    // Sort items by date
    filteredItems.sort(function(a, b) {

        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        if (sort === "newest") {

            return dateB - dateA;

        } else {

            return dateA - dateB;

        }

    });

    // Display filtered and sorted items
    displayItems(filteredItems);

}

// Function for report buttons
function showMessage(type) {

    window.location.href = "report.html?type=" + type;

}

// Search event
document.getElementById("searchInput")
    .addEventListener("input", filterItems);

// Category filter event
document.getElementById("categoryFilter")
    .addEventListener("change", filterItems);

// Lost and Found filter event
document.getElementById("typeFilter")
    .addEventListener("change", filterItems);

// Date sorting event
document.getElementById("dateSort")
    .addEventListener("change", filterItems);

// Load items when homepage opens
loadItems();
