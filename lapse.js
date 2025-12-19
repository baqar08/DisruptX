const display = document.getElementById("lapse-display");
const btnStart = document.getElementById("btn-start");
const btnStop = document.getElementById("btn-stop");
const logContainer = document.getElementById("event-log");

const valLapses = document.getElementById("val-lapses");
const valResponses = document.getElementById("val-responses");
const valFalse = document.getElementById("val-false");

const state = {
    running: false,
    timer: null,
    active: false,
    startTime: 0,
    lapses: 0,
    responses: 0,
    falseStarts: 0,
    timeoutId: null
};

function startTask() {
    state.running = true;
    state.active = false;
    state.lapses = 0;
    state.responses = 0;
    state.falseStarts = 0;

    updateStats();
    logContainer.innerHTML = "";

    btnStart.disabled = true;
    btnStop.disabled = false;

    display.textContent = "Wait...";
    display.className = "";

    scheduleNext();
}

function stopTask() {
    state.running = false;
    clearTimeout(state.timer);
    clearTimeout(state.timeoutId);

    btnStart.disabled = false;
    btnStop.disabled = true;
    display.textContent = "Stopped";
    display.className = "";
}

function scheduleNext() {
    if (!state.running) return;

    state.active = false;
    display.textContent = "Wait...";
    display.className = "";

    const delay = 2000 + Math.random() * 4000;

    state.timer = setTimeout(() => {
        if (!state.running) return;
        triggerStimulus();
    }, delay);
}

function triggerStimulus() {
    state.active = true;
    state.startTime = Date.now();
    display.classList.add("active");
    display.textContent = "CLICK!";

    state.timeoutId = setTimeout(() => {
        if (state.running && state.active) {
            handleLapse();
        }
    }, 1000);
}

function handleInput() {
    if (!state.running) return;

    if (state.active) {
        const rt = Date.now() - state.startTime;
        clearTimeout(state.timeoutId);

        state.responses++;
        state.active = false;

        logEvent(`Response detected: ${rt}ms`);
        display.textContent = `${rt}ms`;
        display.style.background = "#2ecc71";
        display.style.color = "white";

        updateStats();
        setTimeout(scheduleNext, 1000);

    } else {
        state.falseStarts++;
        logEvent("False Start (Too early!)", "false");

        display.textContent = "Too Early!";
        display.style.background = "#fdcb6e";

        clearTimeout(state.timer);
        updateStats();
        setTimeout(scheduleNext, 1500);
    }
}

function handleLapse() {
    state.lapses++;
    state.active = false;

    logEvent("Attention Lapse Detected!", "lapse");
    display.textContent = "MISSED!";
    display.style.background = "#e74c3c";

    updateStats();
    setTimeout(scheduleNext, 1000);
}

function logEvent(msg, type = "") {
    const div = document.createElement("div");
    div.className = "log-item " + type;

    const time = new Date().toLocaleTimeString().split(" ")[0];
    div.innerHTML = `<span>${msg}</span><span>${time}`;

    logContainer.prepend(div);
}

function updateStats() {
    valLapses.textContent = state.lapses;
    valResponses.textContent = state.responses;
    valFalse.textContent = state.falseStarts;
}

display.addEventListener("mousedown", handleInput);

window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && state.running) {
        e.preventDefault();
        handleInput();
    }
});

btnStart.addEventListener("click", startTask);
btnStop.addEventListener("click", stopTask);
