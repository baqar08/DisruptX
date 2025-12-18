const btnVisual = document.getElementById("btn-visual-only");
const btnAudio = document.getElementById("btn-audio-only");
const btnDual = document.getElementById("btn-dual");
const btnStop = document.getElementById("btn-stop");

const visStimulus = document.getElementById("visual-stimulus");
const audIndicator = document.getElementById("audio-indicator");

const spanVisCorrect = document.getElementById("vis-correct");
const spanVisWrong = document.getElementById("vis-wrong");
const spanAudCorrect = document.getElementById("aud-correct");
const spanAudWrong = document.getElementById("aud-wrong");

const resCard = document.getElementById("results-card");
const resMode = document.getElementById("res-mode");
const resVisAcc = document.getElementById("res-vis-acc");
const resAudAcc = document.getElementById("res-aud-acc");
const resCombined = document.getElementById("res-combined");

const state = {
    running: false,
    mode: null,
    visTimer: null,
    audTimer: null,

    visActive: false,
    visIsTarget: false,
    visWindowEnd: 0,

    audActive: false,
    audIsTarget: false,
    audWindowEnd: 0,

    visStats: { correct: 0, wrong: 0, total: 0 },
    audStats: { correct: 0, wrong: 0, total: 0 }
};

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.value = freq;

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();

    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
    osc.stop(audioCtx.currentTime + 0.3);
}

function resetStats() {
    state.visStats = { correct: 0, wrong: 0, total: 0 };
    state.audStats = { correct: 0, wrong: 0, total: 0 };
    updateUI();
    resCard.style.display = 'none';
    visStimulus.textContent = "Waiting...";
    visStimulus.className = "";
    visStimulus.style.backgroundColor = "#f1f2f6";
    visStimulus.style.color = "#2d3436";
    audIndicator.style.opacity = "0.3";
}

function startSession(mode) {
    state.running = true;
    state.mode = mode;
    resetStats();

    btnVisual.disabled = true;
    btnAudio.disabled = true;
    btnDual.disabled = true;
    btnStop.disabled = false;

    if (mode === 'visual' || mode === 'dual') {
        scheduleVisual();
    }
    if (mode === 'audio' || mode === 'dual') {
        scheduleAudio();
    }
}

function stopSession(manual = false) {
    state.running = false;
    clearTimeout(state.visTimer);
    clearTimeout(state.audTimer);

    visStimulus.textContent = "Stopped";
    visStimulus.style.backgroundColor = "#f1f2f6";

    btnVisual.disabled = false;
    btnAudio.disabled = false;
    btnDual.disabled = false;
    btnStop.disabled = true;

    if (!manual) showResults();
}

function scheduleVisual() {
    if (!state.running) return;
    const delay = 1000 + Math.random() * 2000;
    state.visTimer = setTimeout(triggerVisual, delay);
}

function triggerVisual() {
    if (!state.running) return;

    state.visIsTarget = Math.random() > 0.5;
    state.visActive = true;
    state.visWindowEnd = Date.now() + 1000;
    state.visStats.total++;

    if (state.visIsTarget) {
        visStimulus.textContent = "TARGET (Press A)";
        visStimulus.style.backgroundColor = "var(--success-color)";
        visStimulus.style.color = "#fff";
    } else {
        visStimulus.textContent = "IGNORE";
        visStimulus.style.backgroundColor = "var(--error-color)";
        visStimulus.style.color = "#fff";
    }

    setTimeout(() => {
        if (!state.running) return;
        if (state.visActive) {
            // Missed target or correctly ignored non-target?
            if (state.visIsTarget) {
                state.visStats.wrong++;
            } else {
                state.visStats.correct++;
            }
            endVisualEvent();
        }
        scheduleVisual();
    }, 1000);
}

function endVisualEvent() {
    state.visActive = false;
    visStimulus.textContent = "...";
    visStimulus.style.backgroundColor = "#f1f2f6";
    visStimulus.style.color = "#2d3436";
    updateUI();
}

function scheduleAudio() {
    if (!state.running) return;
    const delay = 1200 + Math.random() * 2500;
    state.audTimer = setTimeout(triggerAudio, delay);
}

function triggerAudio() {
    if (!state.running) return;

    state.audIsTarget = Math.random() > 0.5;
    state.audActive = true;
    state.audWindowEnd = Date.now() + 1000;
    state.audStats.total++;

    audIndicator.style.opacity = "1";
    setTimeout(() => audIndicator.style.opacity = "0.3", 200);

    if (state.audIsTarget) {
        playTone(880, 'sine'); // High
    } else {
        playTone(300, 'square'); // Low
    }

    setTimeout(() => {
        if (!state.running) return;
        if (state.audActive) {
            if (state.audIsTarget) {
                state.audStats.wrong++;
            } else {
                state.audStats.correct++;
            }
            state.audActive = false;
            updateUI();
        }
        scheduleAudio();
    }, 1000);
}

function handleInput(type) {
    if (!state.running) return;

    if (type === 'visual') {
        if (!state.visActive) return;

        if (state.visIsTarget) {
            state.visStats.correct++;
        } else {
            state.visStats.wrong++;
        }
        state.visActive = false;
        visStimulus.textContent = "Got it!";
        visStimulus.style.backgroundColor = "#dfe6e9";
        visStimulus.style.color = "#2d3436";
        updateUI();
    }

    if (type === 'audio') {
        if (!state.audActive) return;

        if (state.audIsTarget) {
            state.audStats.correct++;
        } else {
            state.audStats.wrong++;
        }
        state.audActive = false;
        updateUI();
    }
}

function updateUI() {
    spanVisCorrect.textContent = state.visStats.correct;
    spanVisWrong.textContent = state.visStats.wrong;
    spanAudCorrect.textContent = state.audStats.correct;
    spanAudWrong.textContent = state.audStats.wrong;
}

function showResults() {
    resCard.style.display = 'block';
    resMode.textContent = state.mode.toUpperCase();

    const visTotal = state.visStats.correct + state.visStats.wrong;
    const audTotal = state.audStats.correct + state.audStats.wrong;

    const visAcc = visTotal > 0 ? Math.round((state.visStats.correct / visTotal) * 100) : 0;
    const audAcc = audTotal > 0 ? Math.round((state.audStats.correct / audTotal) * 100) : 0;

    resVisAcc.textContent = visAcc;
    resAudAcc.textContent = audAcc;

    let combined = 0;
    if (state.mode === 'dual') {
        combined = Math.round((visAcc + audAcc) / 2);
    } else if (state.mode === 'visual') {
        combined = visAcc;
    } else {
        combined = audAcc;
    }
    resCombined.textContent = combined;

    try {
        localStorage.setItem("adhd_last_dual_session", JSON.stringify({
            type: "dual-task",
            mode: state.mode,
            visAccuracy: visAcc,
            audAccuracy: audAcc,
            combined: combined,
            timestamp: new Date().toISOString()
        }));
    } catch (e) { }
}

btnVisual.addEventListener("click", () => startSession('visual'));
btnAudio.addEventListener("click", () => startSession('audio'));
btnDual.addEventListener("click", () => startSession('dual'));
btnStop.addEventListener("click", () => stopSession(false));

visStimulus.addEventListener("click", () => handleInput('visual'));

window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === 'a') {
        handleInput('visual');
    }
    if (e.key.toLowerCase() === 'l') {
        handleInput('audio');
    }
    if (e.key === ' ' && state.mode === 'audio') {
        // Allow space for single task audio as well
        handleInput('audio');
    }
});
