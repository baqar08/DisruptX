const displayBox = document.getElementById("memory-display");
const inputArea = document.getElementById("memory-input-area");
const userDisplay = document.getElementById("user-sequence-display");
const levelSpan = document.getElementById("current-level");
const bestSpanDisplay = document.getElementById("best-span");

const startLowBtn = document.getElementById("start-low");
const startHighBtn = document.getElementById("start-high");
const stopBtn = document.getElementById("stop-game");

const resultsCard = document.getElementById("results-card");
const resSpan = document.getElementById("res-span");
const resRounds = document.getElementById("res-rounds");
const resDistraction = document.getElementById("res-distraction");

const keypadButtons = document.querySelectorAll(".key-btn[data-val]");
const clearBtn = document.getElementById("btn-clear");
const submitBtn = document.getElementById("btn-submit");

const state = {
    running: false,
    distractionLevel: "low",
    distractionLevel: "low",
    currentLength: 3,
    sequence: [],
    userInput: "",
    roundsPlayed: 0,
    maxSpan: 0
};

function resetGame(level) {
    state.running = true;
    state.distractionLevel = level;
    state.currentLength = 3;
    state.sequence = [];
    state.userInput = "";
    state.roundsPlayed = 0;
    state.maxSpan = 0;

    displayBox.textContent = "Get Ready...";
    inputArea.style.display = "none";
    resultsCard.style.display = "none";
    levelSpan.textContent = state.currentLength;
    bestSpanDisplay.textContent = "0";

    startLowBtn.disabled = true;
    startHighBtn.disabled = true;
    stopBtn.disabled = false;

    startDistractions(level);
    setTimeout(nextRound, 1500);
}

function endGame(manual = false) {
    state.running = false;
    stopDistractions();
    inputArea.style.display = "none";

    startLowBtn.disabled = false;
    startHighBtn.disabled = false;
    stopBtn.disabled = true;

    if (manual) {
        displayBox.textContent = "Game Stopped.";
        return;
    }

    displayBox.textContent = "Game Over!";
    showResults();
}

function showResults() {
    resultsCard.style.display = "block";
    resSpan.textContent = state.maxSpan;
    resRounds.textContent = state.roundsPlayed;
    resDistraction.textContent = state.distractionLevel.toUpperCase();

    try {
        localStorage.setItem("adhd_last_memory_session", JSON.stringify({
            type: "working-memory",
            maxSpan: state.maxSpan,
            rounds: state.roundsPlayed,
            distractionLevel: state.distractionLevel,
            timestamp: new Date().toISOString()
        }));
    } catch (e) { }
}

function nextRound() {
    if (!state.running) return;

    state.userInput = "";
    userDisplay.textContent = "_";
    inputArea.style.display = "none";
    displayBox.textContent = "Watch...";

    levelSpan.textContent = state.currentLength;

    state.sequence = [];
    for (let i = 0; i < state.currentLength; i++) {
        state.sequence.push(Math.floor(Math.random() * 10));
    }

    setTimeout(() => playSequence(0), 1000);
}

function playSequence(index) {
    if (!state.running) return;

    if (index >= state.sequence.length) {
        displayBox.textContent = "YOUR TURN";
        setTimeout(() => {
            if (state.running) enableInput();
        }, 500);
        return;
    }

    displayBox.textContent = state.sequence[index];

    setTimeout(() => {
        if (!state.running) return;
        displayBox.textContent = "";
        setTimeout(() => playSequence(index + 1), 200);
    }, 1000);
}

function enableInput() {
    inputArea.style.display = "flex";
    displayBox.textContent = "?";
    userDisplay.textContent = "";
}

function handleKeyInput(val) {
    if (state.userInput.length < state.sequence.length) {
        state.userInput += val;
        userDisplay.textContent = state.userInput;
    }
}

function submitSequence() {
    if (!state.running) return;

    state.roundsPlayed++;
    const targetStr = state.sequence.join("");

    if (state.userInput === targetStr) {
        state.maxSpan = Math.max(state.maxSpan, state.currentLength);
        bestSpanDisplay.textContent = state.maxSpan;
        state.currentLength++;
        displayBox.textContent = "CORRECT!";
        displayBox.style.color = "var(--success-color)";
        inputArea.style.display = "none";

        setTimeout(() => {
            displayBox.style.color = "var(--accent-color)";
            nextRound();
        }, 1500);
    } else {
        displayBox.textContent = `WRONG! Was: ${targetStr}`;
        displayBox.style.color = "var(--error-color)";
        inputArea.style.display = "none";

        setTimeout(() => {
            displayBox.style.color = "var(--accent-color)";
            endGame();
        }, 2000);
    }
}


startLowBtn.addEventListener("click", () => resetGame("low"));
startHighBtn.addEventListener("click", () => resetGame("high"));
stopBtn.addEventListener("click", () => endGame(true));

keypadButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        handleKeyInput(btn.getAttribute("data-val"));
    });
});

clearBtn.addEventListener("click", () => {
    state.userInput = "";
    userDisplay.textContent = "";
});

submitBtn.addEventListener("click", submitSequence);


window.addEventListener("keydown", (e) => {
    if (!state.running || inputArea.style.display === "none") return;

    if (e.key >= "0" && e.key <= "9") {
        handleKeyInput(e.key);
    } else if (e.key === "Backspace") {
        state.userInput = state.userInput.slice(0, -1);
        userDisplay.textContent = state.userInput;
    } else if (e.key === "Enter") {
        submitSequence();
    }
});
