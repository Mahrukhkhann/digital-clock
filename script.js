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
                                                    


                                                                /* STOPWATCH */

const stopwatchDisplay = document.getElementById("stopwatchDisplay");
const startStopwatchButton = document.getElementById("startStopwatch");
const lapStopwatchButton = document.getElementById("lapStopwatch");
const resetStopwatchButton = document.getElementById("resetStopwatch");
const lapHistory = document.getElementById("lapHistory");
const lapCount = document.getElementById("lapCount");

let stopwatchInterval = null;
let stopwatchRunning = false;

let stopwatchStartTime = 0;
let stopwatchElapsedTime = 0;

let lastLapTime = 0;
let lapNumber = 0;


/* FORMAT STOPWATCH TIME */

function formatStopwatchTime(milliseconds) {

    const totalCentiseconds = Math.floor(milliseconds / 10);

    const centiseconds = totalCentiseconds % 100;

    const totalSeconds = Math.floor(totalCentiseconds / 100);

    const seconds = totalSeconds % 60;

    const totalMinutes = Math.floor(totalSeconds / 60);

    const minutes = totalMinutes % 60;

    const hours = Math.floor(totalMinutes / 60);

    return (
        String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0") +
        "." +
        String(centiseconds).padStart(2, "0")
    );
}


/* UPDATE DISPLAY*/

function updateStopwatchDisplay() {

    stopwatchDisplay.textContent =
        formatStopwatchTime(stopwatchElapsedTime);
}


/*  START / PAUSE */

function toggleStopwatch() {

    if (!stopwatchRunning) {

        /*
         * If the stopwatch was paused, subtract the
         * already elapsed time so that it resumes correctly.
         */
        stopwatchStartTime =
            Date.now() - stopwatchElapsedTime;

        stopwatchRunning = true;

        startStopwatchButton.textContent = "PAUSE";

        lapStopwatchButton.disabled = false;

        stopwatchInterval = setInterval(() => {

            stopwatchElapsedTime =
                Date.now() - stopwatchStartTime;

            updateStopwatchDisplay();

        }, 10);

    } else {

        /*
         * Save the exact elapsed time before pausing.
         */
        stopwatchElapsedTime =
            Date.now() - stopwatchStartTime;

        stopwatchRunning = false;

        clearInterval(stopwatchInterval);

        stopwatchInterval = null;

        startStopwatchButton.textContent = "START";

        updateStopwatchDisplay();
    }
}


/* RECORD LAP */

function recordStopwatchLap() {

    if (!stopwatchRunning) {
        return;
    }

    const currentLapTime =
        stopwatchElapsedTime - lastLapTime;

    lapNumber++;

    lastLapTime = stopwatchElapsedTime;

    const lapRow = document.createElement("div");

    lapRow.className = "lap-row";

    lapRow.innerHTML = `
        <span class="lap-number">
            ${String(lapNumber).padStart(2, "0")}
        </span>

        <span class="lap-time">
            ${formatStopwatchTime(currentLapTime)}
        </span>
    `;

    /*
     * Put the newest lap at the top.
     */
    lapHistory.prepend(lapRow);

    lapCount.textContent = lapNumber;
}


/* RESET STOPWATCH */

function resetStopwatchClock() {

    clearInterval(stopwatchInterval);

    stopwatchInterval = null;

    stopwatchRunning = false;

    stopwatchStartTime = 0;

    stopwatchElapsedTime = 0;

    lastLapTime = 0;

    lapNumber = 0;

    startStopwatchButton.textContent = "START";

    lapStopwatchButton.disabled = true;

    lapHistory.innerHTML = "";

    lapCount.textContent = "0";

    updateStopwatchDisplay();
}


/*  BUTTON EVENTS */

startStopwatchButton.addEventListener(
    "click",
    toggleStopwatch
);

lapStopwatchButton.addEventListener(
    "click",
    recordStopwatchLap
);

resetStopwatchButton.addEventListener(
    "click",
    resetStopwatchClock
);


/*INITIAL DISPLAY */

updateStopwatchDisplay();

                                 // COUNTDOWN TIMER


const countdownHoursInput =
    document.getElementById("countdownHours");

const countdownMinutesInput =
    document.getElementById("countdownMinutes");

const countdownSecondsInput =
    document.getElementById("countdownSeconds");

const countdownDisplay =
    document.getElementById("countdownDisplay");

const countdownStatus =
    document.getElementById("countdownStatus");

const startCountdownButton =
    document.getElementById("startCountdown");

const pauseCountdownButton =
    document.getElementById("pauseCountdown");

const resetCountdownButton =
    document.getElementById("resetCountdown");

const countdownContainer =
    document.querySelector(".countdown-container");


// -------------------------
// Countdown state
// -------------------------

let countdownInterval = null;

let countdownRunning = false;

let countdownEndTime = 0;

let countdownRemainingTime = 0;



// Format countdown time


function formatCountdownTime(milliseconds) {

    const totalSeconds =
        Math.ceil(milliseconds / 1000);

    const seconds =
        totalSeconds % 60;

    const totalMinutes =
        Math.floor(totalSeconds / 60);

    const minutes =
        totalMinutes % 60;

    const hours =
        Math.floor(totalMinutes / 60);


    return (
        String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0")
    );
}



// Get input time


function getCountdownInputTime() {

    const hours =
        Number(countdownHoursInput.value) || 0;

    const minutes =
        Number(countdownMinutesInput.value) || 0;

    const seconds =
        Number(countdownSecondsInput.value) || 0;


    return (
        (hours * 60 * 60 * 1000) +
        (minutes * 60 * 1000) +
        (seconds * 1000)
    );
}

// Update display


function updateCountdownDisplay() {

    countdownDisplay.textContent =
        formatCountdownTime(
            countdownRemainingTime
        );
}

// Start countdown

function startCountdown() {

    /*
     * If the countdown has not started yet,
     * get the time from the input fields.
     */
    if (
        countdownRemainingTime <= 0 &&
        !countdownRunning
    ) {

        countdownRemainingTime =
            getCountdownInputTime();

    }


    /*
     * Prevent starting an empty countdown.
     */
    if (countdownRemainingTime <= 0) {

        countdownStatus.textContent =
            "Please enter a time.";

        return;
    }


    /*
     * Remove completed state.
     */
    countdownContainer.classList.remove(
        "timer-complete"
    );


    /*
     * Calculate when the countdown should finish.
     */
    countdownEndTime =
        Date.now() + countdownRemainingTime;


    countdownRunning = true;


    startCountdownButton.disabled = true;

    pauseCountdownButton.disabled = false;


    countdownStatus.textContent =
        "Timer running";


    /*
     * Update immediately.
     */
    updateCountdown();


    /*
     * Refresh the display frequently.
     * The actual time is calculated using Date.now(),
     * so the timer remains accurate even if the browser
     * delays an interval.
     */
    countdownInterval = setInterval(
        updateCountdown,
        100
    );
}
// Update countdown


function updateCountdown() {

    if (!countdownRunning) {
        return;
    }


    countdownRemainingTime =
        countdownEndTime - Date.now();


    /*
     * Timer has reached zero.
     */
    if (countdownRemainingTime <= 0) {

        countdownRemainingTime = 0;

        updateCountdownDisplay();

        finishCountdown();

        return;
    }


    updateCountdownDisplay();
}

// Pause countdown

function pauseCountdown() {

    if (!countdownRunning) {
        return;
    }


    /*
     * Save the remaining time before pausing.
     */
    countdownRemainingTime =
        countdownEndTime - Date.now();


    if (countdownRemainingTime < 0) {
        countdownRemainingTime = 0;
    }


    countdownRunning = false;


    clearInterval(countdownInterval);

    countdownInterval = null;


    startCountdownButton.disabled = false;

    pauseCountdownButton.disabled = true;


    countdownStatus.textContent =
        "Timer paused";


    updateCountdownDisplay();
}

// Reset countdown
function resetCountdown() {

    countdownRunning = false;


    clearInterval(countdownInterval);

    countdownInterval = null;


    countdownRemainingTime = 0;

    countdownEndTime = 0;


    /*
     * Remove completed animation.
     */
    countdownContainer.classList.remove(
        "timer-complete"
    );


    startCountdownButton.disabled = false;

    pauseCountdownButton.disabled = true;


    countdownStatus.textContent =
        "Ready";


    /*
     * Reset input values.
     */
    countdownHoursInput.value = 0;

    countdownMinutesInput.value = 5;

    countdownSecondsInput.value = 0;


    /*
     * Reset display.
     */
    countdownRemainingTime =
        getCountdownInputTime();

    updateCountdownDisplay();
}

// Timer finished
function finishCountdown() {

    countdownRunning = false;


    clearInterval(countdownInterval);

    countdownInterval = null;


    startCountdownButton.disabled = false;

    pauseCountdownButton.disabled = true;


    countdownStatus.textContent =
        "Timer complete";


    countdownContainer.classList.add(
        "timer-complete"
    );


    playCountdownSound();
}

// Countdown sound
function playCountdownSound() {

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;


    if (!AudioContext) {
        return;
    }


    const audioContext =
        new AudioContext();


    const oscillator =
        audioContext.createOscillator();


    const gain =
        audioContext.createGain();


    oscillator.type = "sine";

    oscillator.frequency.value = 700;


    gain.gain.setValueAtTime(
        0.0001,
        audioContext.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
        0.25,
        audioContext.currentTime + 0.03
    );


    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + 0.6
    );


    oscillator.connect(gain);

    gain.connect(audioContext.destination);


    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 0.6
    );


    /*
     * Close the audio context after the sound.
     */
    setTimeout(() => {

        audioContext.close();

    }, 700);
}

// Input validation

function validateCountdownInput(input, max) {

    let value = Number(input.value);


    if (Number.isNaN(value) || value < 0) {

        value = 0;

    }


    if (value > max) {

        value = max;

    }


    input.value = value;
}

// Input events

countdownHoursInput.addEventListener(
    "change",
    () => {

        validateCountdownInput(
            countdownHoursInput,
            99
        );

    }
);


countdownMinutesInput.addEventListener(
    "change",
    () => {

        validateCountdownInput(
            countdownMinutesInput,
            59
        );

    }
);


countdownSecondsInput.addEventListener(
    "change",
    () => {

        validateCountdownInput(
            countdownSecondsInput,
            59
        );

    }
);
// Button events

startCountdownButton.addEventListener(
    "click",
    startCountdown
);


pauseCountdownButton.addEventListener(
    "click",
    pauseCountdown
);


resetCountdownButton.addEventListener(
    "click",
    resetCountdown
);

// Initial countdown

countdownRemainingTime =
    getCountdownInputTime();

updateCountdownDisplay();

