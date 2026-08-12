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

// =========================
// ALARM CLOCK
// =========================

const alarmInput = document.getElementById("alarmTime");
const setAlarmButton = document.getElementById("setAlarm");
const stopAlarmButton = document.getElementById("stopAlarm");
const alarmStatus = document.getElementById("alarmStatus");


// Load saved alarm

let alarmTime =
    localStorage.getItem("alarmTime") || null;


// Prevent alarm from triggering repeatedly
let alarmTriggered = false;


// Display saved alarm

if (alarmTime) {

    alarmInput.value = alarmTime;

    alarmStatus.textContent =
        `Alarm set for ${formatAlarmTime(alarmTime)}`;

}


// Format alarm time for display

function formatAlarmTime(time) {

    const [hours, minutes] = time.split(":");

    let hour = Number(hours);

    const period = hour >= 12 ? "PM" : "AM";

    if (!is24Hour) {

        hour = hour % 12 || 12;

    }

    return `${pad(hour)}:${minutes} ${period}`;
}


// Set alarm

setAlarmButton.addEventListener("click", () => {

    if (!alarmInput.value) {

        alarmStatus.textContent =
            "Please select an alarm time.";

        return;
    }


    alarmTime = alarmInput.value;

    alarmTriggered = false;


    localStorage.setItem(
        "alarmTime",
        alarmTime
    );


    alarmStatus.textContent =
        `Alarm set for ${formatAlarmTime(alarmTime)}`;

});


// Stop alarm

stopAlarmButton.addEventListener("click", () => {

    stopAlarm();

});


// Check alarm

function checkAlarm() {

    if (!alarmTime || alarmTriggered) {
        return;
    }


    const now = new Date();

    const currentHours =
        String(now.getHours()).padStart(2, "0");

    const currentMinutes =
        String(now.getMinutes()).padStart(2, "0");


    const currentTime =
        `${currentHours}:${currentMinutes}`;


    if (currentTime === alarmTime) {

        triggerAlarm();

    }

}


// Trigger alarm

function triggerAlarm() {

    alarmTriggered = true;


    document.body.classList.add(
        "alarm-ringing"
    );


    alarmStatus.textContent =
        "⏰ ALARM IS RINGING!";


    stopAlarmButton.hidden = false;


    playAlarmSound();

}


// Stop alarm

function stopAlarm() {

    document.body.classList.remove(
        "alarm-ringing"
    );


    stopAlarmButton.hidden = true;


    alarmStatus.textContent =
        alarmTime
            ? `Alarm set for ${formatAlarmTime(alarmTime)}`
            : "No alarm set";

}


// Simple alarm sound using Web Audio API

function playAlarmSound() {

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;


    if (!AudioContext) {
        return;
    }


    const audioContext =
        new AudioContext();


    function beep() {

        if (!document.body.classList.contains("alarm-ringing")) {

            audioContext.close();

            return;
        }


        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();


        oscillator.type = "sine";

        oscillator.frequency.value = 800;


        gain.gain.setValueAtTime(
            0.0001,
            audioContext.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.25,
            audioContext.currentTime + 0.02
        );


        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            audioContext.currentTime + 0.4
        );


        oscillator.connect(gain);

        gain.connect(audioContext.destination);


        oscillator.start();

        oscillator.stop(
            audioContext.currentTime + 0.4
        );


        setTimeout(beep, 800);

    }


    beep();

}


// Check alarm every second

setInterval(checkAlarm, 1000);

