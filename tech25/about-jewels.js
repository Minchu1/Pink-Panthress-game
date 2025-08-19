// 1️⃣ Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// 2️⃣ Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAjJH-gJjPcZeS1Ph-JL15_aN3cq5Ecr5Q",
    authDomain: "pinkpanther-27795.firebaseapp.com",
    databaseURL: "https://pinkpanther-27795-default-rtdb.firebaseio.com",
    projectId: "pinkpanther-27795",
    storageBucket: "pinkpanther-27795.appspot.com",
    messagingSenderId: "950188314786",
    appId: "1:950188314786:web:1be4f4c1e9ed874567c7fb"
};

// 3️⃣ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 4️⃣ Variables to hold data
let data = {};
const selection = {};

// 5️⃣ Disable start buttons until data is loaded
document.querySelectorAll("#startChoice button").forEach(btn => {
    btn.disabled = true;
});

// 6️⃣ Fetch data from Firebase
get(child(ref(db), "crownJewels")).then((snapshot) => {
    if (snapshot.exists()) {
        data.crownJewels = snapshot.val(); // ✅ store data here
        console.log("Data loaded:", data);

        // Enable the buttons after data is ready
        document.querySelectorAll("#startChoice button").forEach(btn => {
            btn.disabled = false;
        });
    } else {
        console.error("No data found.");
    }
}).catch((error) => {
    console.error(error);
});

// 7️⃣ chooseStart function (now safe to use)
window.chooseStart = (type) => {
    selection.startType = type; // "gemType" or "monarch"
    startChoice.style.display = "none";
    categoryChoice.style.display = "block";
    categoryButtons.innerHTML = "";

    const categories = Object.keys(data.crownJewels[type]);
    categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.textContent = cat;
        btn.classList.add("button-52");
        btn.onclick = () => chooseCategory(cat);
        categoryButtons.appendChild(btn);
    });
};
window.chooseCategory = (category) => {
    selection.category = category;
    categoryChoice.style.display = "none";
    timePeriodChoice.style.display = "block";
    timeButtons.innerHTML = "";

    const periods = Object.keys(data.crownJewels[selection.startType][category]);
    periods.forEach(period => {
        const btn = document.createElement("button");
        btn.textContent = period;
        btn.classList.add("button-52");
        btn.onclick = () => chooseTimePeriod(period);
        timeButtons.appendChild(btn);
    });
};

window.chooseTimePeriod = (period) => {
    selection.period = period;
    timePeriodChoice.style.display = "none";
    countryChoice.style.display = "block";
    countryButtons.innerHTML = "";

    const countries = Object.keys(
        data.crownJewels[selection.startType][selection.category][period]
    );
    countries.forEach(country => {
        const btn = document.createElement("button");
        btn.textContent = country;
        btn.classList.add("button-52");
        btn.onclick = () => chooseCountry(country);
        countryButtons.appendChild(btn);
    });
};

window.chooseCountry = (country) => {
    selection.country = country;
    countryChoice.style.display = "none";

    const jewels = data.crownJewels[selection.startType][selection.category][selection.period][country];
    showResult(jewels);
};

function showResult(jewels) {
    const jewelName = Object.keys(jewels)[0];
    const jewelData = jewels[jewelName];

    // Build a nice display of jewel data
    const resultHTML = `
        <p><strong>Jewel:</strong> ${jewelName}</p>
        <p><strong>Material:</strong> ${jewelData.material}</p>
        <p><strong>Taken By:</strong> ${jewelData.takenBy}</p>
    `;

    // Insert into result box
    resultText.innerHTML = resultHTML;
    result.style.display = "block";
}

// Restart button handler
document.getElementById("restartBtn").onclick = () => {
    // Hide result
    result.style.display = "none";

    // Reset selections
    selection.startType = null;
    selection.category = null;
    selection.period = null;
    selection.country = null;

    // Show start choice again
    startChoice.style.display = "block";
};
