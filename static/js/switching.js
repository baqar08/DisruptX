const stimulus = document.getElementById("switch-stimulus");
const ruleDisplay = document.getElementById("rule-display");
const btnStart = document.getElementById("btn-start");
const btnStop = document.getElementById("btn-stop");

const btnLeft = document.getElementById("btn-left");
const btnRight = document.getElementById("btn-right");

const valRepeat = document.getElementById("val-repeat");
const valSwitch = document.getElementById("val-switch");
const valErrors = document.getElementById("val-errors");

const state = {
    running: false,
    currentRule: null,
    prevRule: null,

    currentShape: null,
    currentColor: null,

    startTime: 0,
    trialCount: 0,
    errors: 0,

    rtData: {
        repeat: { sum: 0, count: 0 },
        switch: { sum: 0, count: 0 }
    }
};

function startTask() {
    state.running = true;
    state.trialCount = 0;
    state.errors = 0;
    state.rtData = {
        repeat: { sum: 0, count: 0 },
        switch: { sum: 0, count: 0 }
    };
    state.prevRule = null;

    updateStats();

    btnStart.disabled = true;
    btnStop.disabled = false;

    nextTrial();
}

function stopTask() {
    state.running = false;
    btnStart.disabled = false;
    btnStop.disabled = true;
    ruleDisplay.textContent = "Stopped";
    ruleDisplay.className = "rule-indicator";
    stimulus.className = "";
}

function nextTrial() {
    if (!state.running) return;

    const newRule = Math.random() > 0.5 ? 'COLOR' : 'SHAPE';

    const shape = Math.random() > 0.5 ? 'circle' : 'square';
    const color = Math.random() > 0.5 ? 'blue' : 'orange';

    state.currentRule = newRule;
    state.currentShape = shape;
    state.currentColor = color;

    renderTrial();

    state.startTime = Date.now();
}

function renderTrial() {
    ruleDisplay.textContent = `Rule: ${state.currentRule}`;
    ruleDisplay.className = "rule-indicator active";

    stimulus.className = "";
    stimulus.classList.add(`color-${state.currentColor}`);
    stimulus.classList.add(`shape-${state.currentShape}`);

    if (state.currentRule === 'COLOR') {
        btnLeft.textContent = "Blue";
        btnLeft.style.background = "#0f4c75"; // Walters Primary Blue
        btnLeft.style.color = "#ffffff";
        btnRight.textContent = "Orange";
        btnRight.style.background = "#ea580c"; // Walters Orange
        btnRight.style.color = "#ffffff";
    } else {
        btnLeft.textContent = "Circle";
        btnLeft.style.background = "#4b5563"; // Walters Slate Gray
        btnLeft.style.color = "#ffffff";
        btnRight.textContent = "Square";
        btnRight.style.background = "#4b5563"; // Walters Slate Gray
        btnRight.style.color = "#ffffff";
    }
}

function handleInput(side) {
    if (!state.running) return;

    const rt = Date.now() - state.startTime;
    let correctSide = null;

    if (state.currentRule === 'COLOR') {
        correctSide = (state.currentColor === 'blue') ? 'left' : 'right';
    } else {
        correctSide = (state.currentShape === 'circle') ? 'left' : 'right';
    }

    const isCorrect = (side === correctSide);

    if (isCorrect) {
        recordRT(rt);
    } else {
        state.errors++;
        ruleDisplay.textContent = "WRONG!";
        ruleDisplay.style.background = "#ef4444"; // Walters Red
        ruleDisplay.style.color = "#fff";
    }

    state.prevRule = state.currentRule;
    updateStats();

    setTimeout(nextTrial, 200);
}

function recordRT(rt) {
    if (!state.prevRule) return;

    if (state.currentRule === state.prevRule) {
        state.rtData.repeat.sum += rt;
        state.rtData.repeat.count++;
    } else {
        state.rtData.switch.sum += rt;
        state.rtData.switch.count++;
    }
}

function updateStats() {
    valErrors.textContent = state.errors;

    const r = state.rtData.repeat;
    const s = state.rtData.switch;

    const avgRepeat = r.count ? Math.round(r.sum / r.count) : 0;
    const avgSwitch = s.count ? Math.round(s.sum / s.count) : 0;

    valRepeat.textContent = avgRepeat ? `${avgRepeat}ms` : "--";
    valSwitch.textContent = avgSwitch ? `${avgSwitch}ms` : "--";
}

btnLeft.addEventListener("click", () => handleInput('left'));
btnRight.addEventListener("click", () => handleInput('right'));

window.addEventListener("keydown", (e) => {
    if (!state.running) return;
    if (e.key === "ArrowLeft") handleInput('left');
    if (e.key === "ArrowRight") handleInput('right');
});

btnStart.addEventListener("click", startTask);
btnStop.addEventListener("click", stopTask);
