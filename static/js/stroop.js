const display = document.getElementById("stroop-display");
const inputArea = document.getElementById("input-area");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const colorBtns = document.querySelectorAll(".color-btn");

const accDisplay = document.getElementById("acc-display");
const rtDisplay = document.getElementById("rt-display");
const trialDisplay = document.getElementById("trial-display");

const resCard = document.getElementById("results-card");
const resAcc = document.getElementById("res-acc");
const resCon = document.getElementById("res-con");
const resInc = document.getElementById("res-inc");
const resCost = document.getElementById("res-cost");

const COLORS = ["red", "blue", "green", "yellow"];
const HEX_CODES = {
    red: "#e74c3c",
    blue: "#3498db",
    green: "#2ecc71",
    yellow: "#f1c40f"
};

const state = {
    running: false,
    trials: 0,
    maxTrials: 20,
    currentWord: "",
    currentColor: "",
    isCongruent: false,
    startTime: 0,
    results: []
};

function resetGame() {
    state.running = true;
    state.trials = 0;
    state.results = [];

    startBtn.disabled = true;
    stopBtn.disabled = false;
    resCard.style.display = "none";
    inputArea.style.opacity = "1";
    inputArea.style.pointerEvents = "auto";

    updateStats();
    nextTrial();
}

function stopGame(manual = false) {
    state.running = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    inputArea.style.opacity = "0.5";
    inputArea.style.pointerEvents = "none";

    display.textContent = manual ? "Stopped" : "Done!";
    display.style.color = "#2d3436";

    if (!manual) showResults();
}

function nextTrial() {
    if (state.trials >= state.maxTrials) {
        stopGame();
        return;
    }

    state.trials++;
    updateStats();

    state.currentWord = COLORS[Math.floor(Math.random() * COLORS.length)];
    const forceCongruent = Math.random() > 0.5;

    if (forceCongruent) {
        state.currentColor = state.currentWord;
    } else {
        let others = COLORS.filter(c => c !== state.currentWord);
        state.currentColor = others[Math.floor(Math.random() * others.length)];
    }

    state.isCongruent = (state.currentWord === state.currentColor);

    display.textContent = "+";
    display.style.color = "#2d3436";

    setTimeout(() => {
        if (!state.running) return;
        display.textContent = state.currentWord;
        display.style.color = HEX_CODES[state.currentColor];
        state.startTime = Date.now();
    }, 500);
}

function handleInput(selectedColor) {
    if (!state.running) return;

    const rt = Date.now() - state.startTime;
    const correct = (selectedColor === state.currentColor);

    state.results.push({
        congruent: state.isCongruent,
        correct: correct,
        rt: rt
    });

    if (!correct) {
        display.textContent = "WRONG";
        display.style.color = "#2d3436";
    }

    updateStats();
    setTimeout(nextTrial, 200);
}

function updateStats() {
    trialDisplay.textContent = `${state.trials} / ${state.maxTrials}`;

    if (state.results.length > 0) {
        const correctCount = state.results.filter(r => r.correct).length;
        const acc = Math.round((correctCount / state.results.length) * 100);
        accDisplay.textContent = acc;

        const lastRt = state.results[state.results.length - 1].rt;
        rtDisplay.textContent = lastRt;
    } else {
        accDisplay.textContent = "0";
        rtDisplay.textContent = "--";
    }
}

function showResults() {
    resCard.style.display = "block";

    const correctItems = state.results.filter(r => r.correct);
    const accuracy = Math.round((correctItems.length / state.maxTrials) * 100);

    const congruentItems = correctItems.filter(r => r.congruent);
    const incongruentItems = correctItems.filter(r => !r.congruent);

    const avgCon = congruentItems.length ? Math.round(congruentItems.reduce((a, b) => a + b.rt, 0) / congruentItems.length) : 0;
    const avgInc = incongruentItems.length ? Math.round(incongruentItems.reduce((a, b) => a + b.rt, 0) / incongruentItems.length) : 0;

    const cost = avgInc - avgCon;

    resAcc.textContent = accuracy;
    resCon.textContent = avgCon;
    resInc.textContent = avgInc;
    resCost.textContent = cost;

    try {
        localStorage.setItem("adhd_last_stroop_session", JSON.stringify({
            type: "stroop",
            accuracy,
            congruentRT: avgCon,
            incongruentRT: avgInc,
            interferenceCost: cost,
            timestamp: new Date().toISOString()
        }));
    } catch (e) { }
}

startBtn.addEventListener("click", resetGame);
stopBtn.addEventListener("click", () => stopGame(true));

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        handleInput(btn.getAttribute("data-color"));
    });
});
