const display = document.getElementById("sart-display");
const btnStart = document.getElementById("btn-start");
const btnStop = document.getElementById("btn-stop");
const timeline = document.getElementById("timeline");
const driftAlert = document.getElementById("drift-alert");

const statCommission = document.getElementById("stat-commission");
const statOmission = document.getElementById("stat-omission");
const statDrift = document.getElementById("stat-drift");

const thoughts = [
    "This is boring", "Did I lock the door?", "What time is it?",
    "I'm hungry", "Look at the wall", "My leg itches",
    "Focus...", "Did I text them back?", "What was that noise?"
];

const state = {
    running: false,
    timer: null,
    trialTimer: null,
    thoughtTimer: null,
    currentDigit: null,
    startTime: 0,
    responded: false,

    commissions: 0,
    omissions: 0,
    drifts: 0,
    rts: [],

    interval: 1150,
    displayTime: 250,
};

function startTask() {
    state.running = true;
    state.commissions = 0;
    state.omissions = 0;
    state.drifts = 0;
    state.rts = [];

    updateStats();
    timeline.innerHTML = "";
    driftAlert.style.display = "none";

    btnStart.disabled = true;
    btnStop.disabled = false;

    display.textContent = "...";

    setTimeout(nextTrial, 1000);
    scheduleThought();
}

function stopTask() {
    state.running = false;
    clearTimeout(state.timer);
    clearTimeout(state.trialTimer);
    clearTimeout(state.thoughtTimer);

    display.classList.remove("blur-drift");
    const existing = display.querySelector(".intrusive-thought");
    if (existing) existing.remove();

    btnStart.disabled = false;
    btnStop.disabled = true;
    display.textContent = "Done";
}

function scheduleThought() {
    if (!state.running) return;
    const delay = 2000 + Math.random() * 4000;
    state.thoughtTimer = setTimeout(() => {
        showThought();
        scheduleThought();
    }, delay);
}

function showThought() {
    if (!state.running) return;
    const txt = thoughts[Math.floor(Math.random() * thoughts.length)];
    const el = document.createElement("div");
    el.className = "intrusive-thought";
    el.textContent = txt;

    const rect = display.getBoundingClientRect();
    const randomX = (Math.random() - 0.5) * 100;
    const randomY = (Math.random() - 0.5) * 60;
    el.style.transform = `translate(calc(-50% + ${randomX}px), calc(-50% + ${randomY}px))`;

    display.appendChild(el);

    setTimeout(() => {
        if (el.parentNode) el.remove();
    }, 3000);
}

function nextTrial() {
    if (!state.running) return;

    state.responded = false;
    state.currentDigit = Math.floor(Math.random() * 9) + 1;

    display.textContent = state.currentDigit;
    state.startTime = Date.now();
    display.style.color = "";

    if (Math.random() > 0.7) {
        display.classList.add("blur-drift");
    } else {
        display.classList.remove("blur-drift");
    }

    state.trialTimer = setTimeout(() => {
        if (state.running) display.textContent = "+";
        display.classList.remove("blur-drift");
    }, state.displayTime);

    state.timer = setTimeout(() => {
        analyzeTrial();
        nextTrial();
    }, state.interval);
}

function handleInput() {
    if (!state.running || state.responded) return;

    const rt = Date.now() - state.startTime;
    state.responded = true;

    recordResponse(rt, true);
}

function analyzeTrial() {
    if (state.responded) return;

    if (state.currentDigit === 3) {
        recordResponse(0, false);
    } else {
        state.omissions++;
        recordResponse(0, false, "omission");
    }
}

function recordResponse(rt, clicked, errorType = null) {
    let isDrift = false;
    let isStable = true;

    if (clicked) {
        if (state.currentDigit === 3) {
            state.commissions++;
            isDrift = true;
            isStable = false;
            flashDrift("Commission Error!");
        } else {
            const avg = getAvgRT();
            if (avg > 0 && rt > avg * 1.5) {
                state.drifts++;
                isDrift = true;
                isStable = false;
                flashDrift("Speed slowing...");
            }
        }
    } else {
        if (state.currentDigit !== 3) {
            isDrift = true;
            isStable = false;
            flashDrift("Missed Target!");
        }
    }

    if (clicked) state.rts.push(rt);
    updateStats();
    drawBar(rt, isDrift, isStable, clicked);
}

function getAvgRT() {
    if (state.rts.length < 5) return 0;
    const sum = state.rts.reduce((a, b) => a + b, 0);
    return sum / state.rts.length;
}

function drawBar(rt, isDrift, isStable, clicked) {
    const bar = document.createElement("div");
    bar.className = "time-bar";

    let hPct = 0;
    if (clicked) {
        hPct = Math.min(100, (rt / 800) * 100);
    } else {
        hPct = 5;
    }
    bar.style.height = hPct + "%";

    if (isDrift) {
        bar.classList.add("drift-point");
    } else if (isStable && clicked) {
        bar.classList.add("stable-point");
    }

    timeline.appendChild(bar);
    timeline.scrollLeft = timeline.scrollWidth;
}

function flashDrift(msg) {
    driftAlert.textContent = "⚠️ " + msg;
    driftAlert.style.display = "block";
    setTimeout(() => {
        driftAlert.style.display = "none";
    }, 1000);
}

function updateStats() {
    statCommission.textContent = state.commissions;
    statOmission.textContent = state.omissions;
    statDrift.textContent = state.drifts;
}

window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && state.running) {
        e.preventDefault();
        handleInput();
    }
});

display.addEventListener("mousedown", () => {
    if (state.running) handleInput();
});

btnStart.addEventListener("click", startTask);
btnStop.addEventListener("click", stopTask);
