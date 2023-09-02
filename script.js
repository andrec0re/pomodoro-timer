let minutes = 25;
let seconds = 0;
let focusSessions = 0;
let isRunning = false;
let isPaused = false;
let timerInterval;
let currentMode = "focus";
let focusTimeDefault = 20;
let shortBreakTimeDefault = 5;
let longBreakTimeDefault = 20;
let currentFocusTime = focusTimeDefault;
let currentShortBreakTime = shortBreakTimeDefault;
let currentLongBreakTime = longBreakTimeDefault;
let autoStartBreaks = false;
let autoStartPomodoros = false;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startPauseBtn = document.getElementById('start-pause-btn');
const resetBtn = document.getElementById('reset-btn');
const focusBtn = document.getElementById('focus-btn');
const shortBreakBtn = document.getElementById('short-break-btn');
const longBreakBtn = document.getElementById('long-break-btn');
const focusDuration = document.getElementById('focus-duration');
const shortBreakDuration = document.getElementById('short-break-duration');
const longBreakDuration = document.getElementById('long-break-duration');
const timerStartAudio = new Audio('sounds/timer-start.mp3');
const timerEndAudio = new Audio('sounds/alarm-kitchen.mp3');
const modal = document.querySelector('.modal');
const settingsIcon = document.querySelector('.settings-icon');
const closeBtn = document.getElementById('close-settings');
const saveBtn = document.getElementById('save-settings');
const resetSettingsBtn = document.getElementById('reset-settings');
const focusRangeValue = document.querySelector('.focus-range-value');
const shortBreakRangeValue = document.querySelector('.short-break-range-value');
const longBreakRangeValue = document.querySelector('.long-break-range-value');
const autoStartBreaksToggle = document.getElementById('auto-start-breaks');
const autoStartPomodorosToggle = document.getElementById('auto-start-pomodoros')
const timerDurations = {
    focus: () => currentFocusTime,
    shortBreak: () => currentShortBreakTime,
    longBreak: () => currentLongBreakTime
};

startPauseBtn.addEventListener("click", toogleTimer);
resetBtn.addEventListener("click", resetTimer);
focusBtn.addEventListener("click", () => setTimer(currentFocusTime, 0, "focus"));
shortBreakBtn.addEventListener("click", () => setTimer(currentShortBreakTime, 0, "shortBreak"));
longBreakBtn.addEventListener("click", () => setTimer(currentLongBreakTime, 0, "longBreak"));
focusDuration.addEventListener("input", (event) => { focusRangeValue.textContent = event.target.value + " min" });
shortBreakDuration.addEventListener("input", (event) => { shortBreakRangeValue.textContent = event.target.value + " min" });
longBreakDuration.addEventListener("input", (event) => { longBreakRangeValue.textContent = event.target.value + " min" });
settingsIcon.addEventListener("click", () => {
    modal.style.display = 'block';
    resetModalToSavedState();
});
closeBtn.addEventListener("click", () => {
    modal.style.display = 'none';
    resetModalToSavedState();
});
saveBtn.addEventListener("click", () => {
    modal.style.display = 'none';
    saveSettings()
});

resetSettingsBtn.addEventListener("click", () => {
    resetTimersToDefault();
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        resetModalToSavedState();
    }
});

timerEndAudio.preload = 'auto';
timerStartAudio.preload = 'auto';

function resetModalToSavedState() {
    autoStartBreaksToggle.checked = autoStartBreaks;
    autoStartPomodorosToggle.checked = autoStartPomodoros;
    focusDuration.value = currentFocusTime;
    shortBreakDuration.value = currentShortBreakTime;
    longBreakDuration.value = currentLongBreakTime;
    focusRangeValue.textContent = currentFocusTime + " min";
    shortBreakRangeValue.textContent = currentShortBreakTime + " min";
    longBreakRangeValue.textContent = currentLongBreakTime + " min";
}

function saveSettings() {
    currentFocusTime = focusDuration.value;
    currentShortBreakTime = shortBreakDuration.value;
    currentLongBreakTime = longBreakDuration.value;
    if (isRunning === false && isPaused === false) {
        minutes = timerDurations[currentMode]();
    }
    autoStartBreaks = autoStartBreaksToggle.checked;
    autoStartPomodoros = autoStartPomodorosToggle.checked;
    updateDisplay();
}


function resetTimersToDefault() {
    focusDuration.value = focusTimeDefault;
    shortBreakDuration.value = shortBreakTimeDefault;
    longBreakDuration.value = longBreakTimeDefault;
    focusRangeValue.textContent = focusTimeDefault + " min";
    shortBreakRangeValue.textContent = shortBreakTimeDefault + " min";
    longBreakRangeValue.textContent = longBreakTimeDefault + " min";
}

function setTimer(mins, secs = 0, mode = currentMode) {
    pauseTimer();
    minutes = mins;
    seconds = secs;
    currentMode = mode;
    updateActiveButton();
    updateDisplay();
}

function updateActiveButton() {
    focusBtn.classList.remove('active');
    shortBreakBtn.classList.remove('active');
    longBreakBtn.classList.remove('active');

    if (currentMode === "focus") {
        focusBtn.classList.add('active');
    } else if (currentMode === "shortBreak") {
        shortBreakBtn.classList.add('active');
    } else if (currentMode === "longBreak") {
        longBreakBtn.classList.add('active');
    }
}

function startTimer() {
    if (isRunning === true) { return; }
    else {
        isRunning = true;
    }
    updateStartPauseButton();
    if (!isPaused)
        timerStartAudio.play();

    timerInterval = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0 && isRunning === true) {
                timerEnd();
            } else {
                minutes--;
                seconds = 59;
            }
        } else {
            seconds--;
        }
        updateDisplay();
    }, 1000);
}

function pauseTimer() {
    if (isRunning === false) { return; }
    updateStartPauseButton();
    clearInterval(timerInterval);
    isRunning = false;
    isPaused = true;
}

function resetTimer() {
    clearInterval(timerInterval);
    stopAudio();
    isRunning = false;
    isPaused = false;
    if (currentMode === "focus") {
        minutes = currentFocusTime;
    } else if (currentMode === "shortBreak") {
        minutes = currentShortBreakTime;
    } else if (currentMode === "longBreak") {
        minutes = currentLongBreakTime;
    }
    seconds = 0;
    updateDisplay();
    updateStartPauseButton();
}

function toogleTimer() {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer()
    };
    updateStartPauseButton();
}

function timerEnd() {
    clearInterval(timerInterval);
    timerEndAudio.play();
    isRunning = false;
    let flashCount = 0;
    minutesDisplay.style.visibility = 'hidden';
    secondsDisplay.style.visibility = 'hidden';
    flashCount++;

    const flashInterval = setInterval(() => {
        if (flashCount % 2 === 0) {
            minutesDisplay.style.visibility = 'hidden';
            secondsDisplay.style.visibility = 'hidden';
        } else {
            minutesDisplay.style.visibility = 'visible';
            secondsDisplay.style.visibility = 'visible';
        }
        flashCount++;

        if (flashCount >= 8) {
            clearInterval(flashInterval);
            minutesDisplay.style.visibility = 'visible';
            secondsDisplay.style.visibility = 'visible';
            // switch timer
            if (currentMode === "focus") {
                focusSessions++;
                if (focusSessions % 4 === 0) {
                    setTimer(currentLongBreakTime, 0, "longBreak");
                } else {
                    setTimer(currentShortBreakTime, 0, "shortBreak");
                }
                if (autoStartBreaks) {
                    startTimer();
                }
            } else {
                setTimer(currentFocusTime, 0, "focus");
                if (autoStartPomodoros) {
                    startTimer();
                }
            }
        }
    }, 500);
}

function updateStartPauseButton() {
    if (isRunning) {
        startPauseBtn.textContent = 'Pause';
        startPauseBtn.classList.add('running');
    }
    else {
        startPauseBtn.textContent = 'Start';
        startPauseBtn.classList.remove('running');
    }
}

function stopAudio() {
    timerStartAudio.pause();
    timerStartAudio.currentTime = 0;
    timerEndAudio.pause();
    timerEndAudio.currentTime = 0;
}

function updateDisplay() {
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

updateDisplay();