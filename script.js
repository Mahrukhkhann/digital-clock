function updateClock() {
    const now = new Date();

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    document.getElementById("time").textContent =
        `${hours}:${minutes}:${seconds}`;
}

updateClock();

setInterval(updateClock, 1000);