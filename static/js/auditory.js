const stimulus = document.getElementById("auditory-stimulus");
const btnStart = document.getElementById("btn-start");
const btnStop = document.getElementById("btn-stop");
const btnSilent = document.getElementById("mode-silent");
const btnNoisy = document.getElementById("mode-noisy");

const valSilent = document.getElementById("val-rt-silent");
const countSilent = document.getElementById("count-silent");
const valNoisy = document.getElementById("val-rt-noisy");
const countNoisy = document.getElementById("count-noisy");

let audioCtx = null;
let noiseNode = null;
let gainNode = null;

const state = {
    running: false,
    mode: 'silent',
    timer: null,
    startTime: 0,
    awaiting: false,

    stats: {
        silent: { sum: 0, count: 0 },
        noisy: { sum: 0, count: 0 }
    }
};

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function startNoise() {
    initAudio();
    if (!audioCtx) return;

    const bufferSize = audioCtx.sampleRate * 2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
    }

    noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = buffer;
    noiseNode.loop = true;

    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.15;

    noiseNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    noiseNode.start();
}
let lastOut = 0;

function stopNoise() {
    if (noiseNode) {
        try {
            noiseNode.stop();
        } catch (e) { }
        noiseNode = null;
    }
}

function setMode(mode) {
    if (state.running) return;
    state.mode = mode;

    if (mode === 'silent') {
        btnSilent.classList.add('active');
        btnNoisy.classList.remove('active');
    } else {
        btnSilent.classList.remove('active');
        btnNoisy.classList.add('active');
    }
}

function startTask() {
    state.running = true;

    btnStart.disabled = true;
    btnStop.disabled = false;
    btnSilent.disabled = true;
    btnNoisy.disabled = true;

    if (state.mode === 'noisy') {
        startNoise();
    }

    stimulus.textContent = "Wait";
    stimulus.className = "";

    scheduleNext();
}

function stopTask() {
    state.running = false;
    clearTimeout(state.timer);
    stopNoise();

    btnStart.disabled = false;
    btnStop.disabled = true;
    btnSilent.disabled = false;
    btnNoisy.disabled = false;

    stimulus.textContent = "Stopped";
    stimulus.className = "";
}

function scheduleNext() {
    if (!state.running) return;

    state.awaiting = false;
    stimulus.textContent = "Wait";
    stimulus.className = "";
    stimulus.style.background = "";

    const delay = 1000 + Math.random() * 2000;

    state.timer = setTimeout(() => {
        if (!state.running) return;

        state.startTime = Date.now();
        state.awaiting = true;
        stimulus.textContent = "CLICK";
        stimulus.className = "target";
        stimulus.style.background = "";

        if (state.mode === 'noisy' && Math.random() > 0.5) {
            playBeep();
        }

    }, delay);
}

function playBeep() {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.connect(g);
    g.connect(audioCtx.destination);
    osc.frequency.value = 800 + Math.random() * 500;
    g.gain.value = 0.1;
    osc.start();
    setTimeout(() => osc.stop(), 100);
}

function handleInput() {
    if (!state.running || !state.awaiting) return;

    const rt = Date.now() - state.startTime;
    state.awaiting = false;

    const s = state.stats[state.mode];
    s.sum += rt;
    s.count++;

    updateUI();

    stimulus.textContent = `${rt}ms`;
    stimulus.style.background = "#2ecc71";

    setTimeout(scheduleNext, 800);
}

function updateUI() {
    const s = state.stats.silent;
    const n = state.stats.noisy;

    valSilent.textContent = s.count ? Math.round(s.sum / s.count) + "ms" : "--";
    countSilent.textContent = s.count + " trials";

    valNoisy.textContent = n.count ? Math.round(n.sum / n.count) + "ms" : "--";
    countNoisy.textContent = n.count + " trials";
}

btnSilent.addEventListener("click", () => setMode('silent'));
btnNoisy.addEventListener("click", () => setMode('noisy'));

stimulus.addEventListener("mousedown", handleInput);
window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && state.running) {
        e.preventDefault();
        handleInput();
    }
});

btnStart.addEventListener("click", startTask);
btnStop.addEventListener("click", stopTask);
