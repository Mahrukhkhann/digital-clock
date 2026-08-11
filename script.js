const timeElement = document.getElementById("time");
const periodElement = document.getElementById("period");
const dateElement = document.getElementById("date");
const formatButton = document.getElementById("formatBtn");


// Load saved format
let is24Hour = localStorage.getItem("clockFormat") === "24";


// Add leading zero
function pad(number) {
    return String(number).padStart(2, "0");
}


// Update clock
function updateClock() {

    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();


    // AM / PM
    const period = hours >= 12 ? "PM" : "AM";


    // Convert to 12-hour format
    if (!is24Hour) {

        hours = hours % 12;

        if (hours === 0) {
            hours = 12;
        }

    }


    // Display time
    timeElement.textContent =
        `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;


    // Display AM/PM only in 12-hour mode
    periodElement.textContent =
        is24Hour ? "" : period;


    // Display date
    dateElement.textContent =
        now.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        });


    // Update button
    formatButton.textContent =
        is24Hour ? "24H" : "12H";
}


// Change format
formatButton.addEventListener("click", () => {

    is24Hour = !is24Hour;

    localStorage.setItem(
        "clockFormat",
        is24Hour ? "24" : "12"
    );

    updateClock();

});


// Start clock
updateClock();

setInterval(updateClock, 1000);