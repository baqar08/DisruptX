
const startLowBtn = document.getElementById("start-low");
const startHighBtn = document.getElementById("start-high");
const stopBtn = document.getElementById("stop-session");

const stimulusBox = document.getElementById("stimulus-box");
const trialCounter = document.getElementById("trial-counter");

const correctSpan = document.getElementById("correct-count");
const wrongSpan = document.getElementById("wrong-count");
const rtAvgSpan = document.getElementById("rt-average");

const resultsCard = document.getElementById("results-card");
const resTrials = document.getElementById("res-trials");
const resAccuracy = document.getElementById("res-accuracy");
const resRT = document.getElementById("res-rt");
const resLevel = document.getElementById("res-level");

const state = {
  running: false,
  distractionLevel: "low",
  totalTrials: 30,
  currentTrial: 0,
  targetProbability: 0.5,
  isTarget: false,
  awaitingResponse: false,
  lastStimulusTime: null,
  responses: [],
  trialTimeoutId: null,
  itiTimeoutId: null
};

function resetUI() {
  correctSpan.textContent = "0";
  wrongSpan.textContent = "0";
  rtAvgSpan.textContent = "–";
  trialCounter.textContent = `Trial: 0 / ${state.totalTrials}`;
  stimulusBox.textContent = "Get ready…";

  stimulusBox.classList.remove("active", "stimulus-target", "stimulus-ignore");
  stimulusBox.style = "";
  resultsCard.style.display = "none";
}

function startSession(level) {
  clearTimeout(state.trialTimeoutId);
  clearTimeout(state.itiTimeoutId);
  stopDistractions();

  state.running = true;
  state.distractionLevel = level;
  state.currentTrial = 0;
  state.responses = [];
  state.isTarget = false;
  state.awaitingResponse = false;
  state.lastStimulusTime = null;

  resetUI();
  startDistractions(level);

  startLowBtn.disabled = true;
  startHighBtn.disabled = true;
  stopBtn.disabled = false;

  scheduleNextTrial();
}

function stopSession(manual = false) {
  state.running = false;
  clearTimeout(state.trialTimeoutId);
  clearTimeout(state.itiTimeoutId);
  stopDistractions();
  stimulusBox.classList.remove("active");

  stimulusBox.style = "";
  stimulusBox.classList.remove("active", "stimulus-target", "stimulus-ignore");

  if (manual) {
    stimulusBox.textContent = "Session stopped.";
  }

  startLowBtn.disabled = false;
  startHighBtn.disabled = false;
  stopBtn.disabled = true;
}

function scheduleNextTrial() {
  if (!state.running) return;

  if (state.currentTrial >= state.totalTrials) {
    endSession();
    return;
  }

  state.awaitingResponse = false;
  stimulusBox.classList.remove("active");

  stimulusBox.style = "";
  stimulusBox.classList.remove("active", "stimulus-target", "stimulus-ignore");

  stimulusBox.textContent = "Waiting…";

  const iti = 400 + Math.random() * 400;
  state.itiTimeoutId = setTimeout(showStimulus, iti);
}

function showStimulus() {
  if (!state.running) return;

  state.currentTrial++;
  trialCounter.textContent = `Trial: ${state.currentTrial} / ${state.totalTrials}`;

  state.isTarget = Math.random() < state.targetProbability;
  state.awaitingResponse = true;
  state.lastStimulusTime = Date.now();

  stimulusBox.classList.add("active");
  if (state.isTarget) {
    stimulusBox.classList.add("stimulus-target");
    stimulusBox.textContent = "TARGET";
  } else {
    stimulusBox.classList.add("stimulus-ignore");
    stimulusBox.textContent = "IGNORE";
  }

  state.trialTimeoutId = setTimeout(() => {
    if (!state.awaitingResponse) return;
    handleNoResponse();
    scheduleNextTrial();
  }, 900);
}

function handleClick() {
  if (!state.running || !state.awaitingResponse) return;

  const now = Date.now();
  const rt = now - state.lastStimulusTime;
  state.awaitingResponse = false;

  const correct = state.isTarget;
  state.responses.push({
    isTarget: state.isTarget,
    reacted: true,
    reactionTime: rt,
    correct
  });

  updateLiveStats();
  scheduleNextTrial();
}

function handleNoResponse() {
  const correct = !state.isTarget;
  state.responses.push({
    isTarget: state.isTarget,
    reacted: false,
    reactionTime: null,
    correct
  });
  updateLiveStats();
}

function updateLiveStats() {
  const { correctCount, wrongCount, avgRT } = computeLiveStats(
    state.responses
  );
  correctSpan.textContent = correctCount.toString();
  wrongSpan.textContent = wrongCount.toString();
  rtAvgSpan.textContent = avgRT != null ? avgRT.toString() : "–";
}

function endSession() {
  stopSession(false);
  stimulusBox.textContent = "Session finished.";

  const { total, correctCount, avgRT } = computeLiveStats(state.responses);
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  resTrials.textContent = total.toString();
  resAccuracy.textContent = accuracy.toString();
  resRT.textContent = avgRT != null ? avgRT.toString() : "–";
  resLevel.textContent = state.distractionLevel.toUpperCase();
  resultsCard.style.display = "block";

  saveSessionToStorage({
    type: "focus",
    totalTrials: total,
    correct: correctCount,
    accuracy,
    avgRT,
    distractionLevel: state.distractionLevel,
    timestamp: new Date().toISOString()
  });
}


if (startLowBtn) {
  startLowBtn.addEventListener("click", () => startSession("low"));
}
if (startHighBtn) {
  startHighBtn.addEventListener("click", () => startSession("high"));
}
if (stopBtn) {
  stopBtn.addEventListener("click", () => {
    stopSession(true);
  });
}
if (stimulusBox) {
  stimulusBox.addEventListener("click", handleClick);
}
