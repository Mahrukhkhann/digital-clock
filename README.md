# 🕒 Vintage Digital Clock

A stylish, responsive **digital clock web application** built with **HTML, CSS, and vanilla JavaScript**. In addition to displaying the current time and date, the application includes an alarm clock, stopwatch, and countdown timer.

## ✨ Features

### 🕐 Digital Clock

* Displays the current time in real time.
* Shows hours, minutes, and seconds.
* Supports both **12-hour and 24-hour formats**.
* Displays **AM/PM** in 12-hour mode.
* Shows the current day, date, month, and year.
* Automatically updates every second.

### ⏰ Alarm Clock

* Set an alarm using a time input.
* Saves the selected alarm using browser `localStorage`.
* Displays the configured alarm time.
* Provides a visual indication when the alarm is triggered.
* Plays an alarm sound using the **Web Audio API**.
* Includes a **Stop Alarm** control.

### ⏱️ Stopwatch

* Start and pause the stopwatch.
* Displays elapsed time with centisecond precision.
* Record multiple laps.
* Displays lap history and lap count.
* Reset the stopwatch and clear all recorded laps.

### ⏳ Countdown Timer

* Set hours, minutes, and seconds.
* Start the countdown.
* Pause and resume the timer.
* Reset the countdown.
* Displays the remaining time in `HH:MM:SS` format.
* Provides a completion state when the timer reaches zero.

### 💾 Local Storage

The application uses browser `localStorage` to remember:

* Preferred clock format (12H/24H)
* Saved alarm time

## 🛠️ Technologies Used

* **HTML5** — Structure and layout
* **CSS3** — Styling, responsive design, and animations
* **JavaScript (ES6+)** — Clock, alarm, stopwatch, and countdown functionality
* **Web Audio API** — Alarm sound generation
* **LocalStorage API** — Saving user preferences and alarm settings

## 📁 Project Structure

```text
digital-clock/
│
├── index.html      # Main HTML structure
├── style.css       # Styling and responsive design
├── script.js       # Clock, alarm, stopwatch and countdown logic
└── .gitattributes  # Git configuration
```

## 🚀 Getting Started

No frameworks, dependencies, or build tools are required.

### 1. Clone the repository

```bash
git clone https://github.com/Mahrukhkhann/digital-clock.git
```

### 2. Open the project

Navigate into the project directory:

```bash
cd digital-clock
```

### 3. Run the application

Simply open `index.html` in your web browser.

You can also use a local development server such as **VS Code Live Server** for a better development experience.

## 🎮 How to Use

### Clock

The clock starts automatically when the page loads. Use the **12H** button to switch between 12-hour and 24-hour formats.

### Alarm

1. Select a time using the alarm time picker.
2. Click **SET ALARM**.
3. When the selected time is reached, the alarm will start.
4. Click **STOP ALARM** to stop it.

### Stopwatch

1. Click **START** to begin.
2. Click **PAUSE** to pause.
3. Click **LAP** while running to record a lap.
4. Click **RESET** to clear the stopwatch and lap history.

### Countdown

1. Enter the desired hours, minutes, and seconds.
2. Click **START**.
3. Use **PAUSE** to temporarily stop the timer.
4. Click **START** again to resume.
5. Click **RESET** to start over.

## 🌐 Browser Compatibility

The project is designed to run in modern web browsers that support standard HTML5, CSS3, JavaScript, Local Storage, and the Web Audio API.

Recommended browsers include:

* Google Chrome
* Mozilla Firefox
* Microsoft Edge
* Safari

## 🎯 Project Purpose

This project is designed as a practical **frontend JavaScript project** for learning and demonstrating:

* DOM manipulation
* JavaScript event handling
* Real-time updates with `setInterval()`
* Date and time handling
* Browser Local Storage
* Web Audio API
* Stopwatch and timer logic
* Responsive UI development
* Building interactive web applications without external frameworks

## 🔮 Possible Future Improvements

* Add multiple alarms.
* Add custom alarm sounds.
* Add dark/light themes.
* Add timezone or world-clock support.
* Add keyboard shortcuts.
* Add persistent stopwatch and countdown states.
* Add customizable clock themes and colors.
* Add sound notifications for countdown completion.
* Improve accessibility with additional ARIA labels and keyboard navigation.

## 👩‍💻 Author

**Mahrukh Khan**

GitHub: [@Mahrukhkhann](https://github.com/Mahrukhkhann)

