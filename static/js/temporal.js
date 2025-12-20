const stimulus = document.getElementById("temporal-stimulus");
const btnStart = document.getElementById("btn-start");
const btnStop = document.getElementById("btn-stop");
const chart = document.getElementById("chart-container");
const blockCountDisp = document.getElementById("block-count");

const state = {
    running: false,
    trialInBlock: 0,
    blockSize: 5,
    blockData: [],
    totalBlocks: 0,
    timer: null,
    startTime: 0,
    awaiting: false,
};

function startTask() {
    state.running = true;
    state.trialInBlock = 0;
    state.blockData = [];
    state.totalBlocks = 0;

    const axis = chart.querySelector('.axis-label');
    chart.innerHTML = '';
    if (axis) chart.appendChild(axis);

    blockCountDisp.textContent = "0";

    btnStart.disabled = true;
    btnStop.disabled = false;

    stimulus.textContent = "Wait";
    stimulus.style.background = "#dfe6e9";

    setTimeout(nextTrial, 1500);
}

function stopTask() {
    state.running = false;
    clearTimeout(state.timer);
    stimulus.textContent = "Stopped";
    stimulus.style.background = "#dfe6e9";
    btnStart.disabled = false;
    btnStop.disabled = true;
}

function nextTrial() {
    if (!state.running) return;
    state.awaiting = false;
    stimulus.style.background = "#dfe6e9";
    stimulus.textContent = "...";

    const delay = 1000 + Math.random() * 1500;

    state.timer = setTimeout(() => {
        if (!state.running) return;
        state.awaiting = true;
        state.startTime = Date.now();
        stimulus.style.background = "#2ecc71";
        stimulus.textContent = "PRESS";
    }, delay);
}

function handleInput() {
    if (!state.running || !state.awaiting) return;

    state.awaiting = false;
    const rt = Date.now() - state.startTime;

    stimulus.textContent = `${rt}ms`;
    stimulus.style.background = "#dfe6e9";

    processTrial(rt);

    setTimeout(nextTrial, 800);
}

function processTrial(rt) {
    state.blockData.push(rt);
    state.trialInBlock++;

    if (state.trialInBlock >= state.blockSize) {
        completeBlock();
    }
}

function completeBlock() {
    state.totalBlocks++;
    blockCountDisp.textContent = state.totalBlocks;

    const sum = state.blockData.reduce((a, b) => a + b, 0);
    const avg = Math.round(sum / state.blockData.length);

    const min = Math.min(...state.blockData);
    const max = Math.max(...state.blockData);
    const range = max - min;

    const isUnstable = range > 300 || avg > 600;

    renderBlock(avg, isUnstable);

    state.trialInBlock = 0;
    state.blockData = [];
}

function renderBlock(val, isWarning) {
    const bar = document.createElement("div");
    bar.className = "block-bar";

    if (isWarning) bar.classList.add("decline");

    const h = Math.min(100, (val / 1000) * 100);
    bar.style.height = `${h}%`;
    bar.setAttribute("data-val", `${val}ms`);

    chart.appendChild(bar);
    chart.scrollLeft = chart.scrollWidth;
}

stimulus.addEventListener("mousedown", handleInput);
window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && state.running) {
        e.preventDefault();
        handleInput();
    }
});

btnStart.addEventListener("click", startTask);
btnStop.addEventListener("click", stopTask);
