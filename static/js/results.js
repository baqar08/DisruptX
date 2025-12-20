function renderFocusResults() {
  const container = document.getElementById("focus-results");
  if (!container) return;

  let data = null;
  try {
    data = JSON.parse(localStorage.getItem("adhd_last_session"));
  } catch (e) {
    data = null;
  }

  if (!data || data.type !== "focus") {
    container.textContent = "No focus-session data found. Run the Focus Task first.";
    return;
  }

  container.innerHTML = `
    <p>Total trials: <strong>${data.totalTrials}</strong></p>
    <p>Correct: <strong>${data.correct}</strong></p>
    <p>Accuracy: <strong>${data.accuracy}%</strong></p>
    <p>Average reaction time: <strong>${data.avgRT ?? "–"} ms</strong></p>
    <p>Distraction level: <strong>${data.distractionLevel.toUpperCase()}</strong></p>
    <p class="note">These are the results from your most recent focus session.</p>
  `;
}

function renderTimeResults() {
  const container = document.getElementById("time-results-summary");
  if (!container) return;

  let data = null;
  try {
    data = JSON.parse(localStorage.getItem("adhd_last_time_test"));
  } catch (e) {
    data = null;
  }

  if (!data || data.type !== "time-perception") {
    container.textContent =
      "No time-perception test data found. Run the Time Perception Test first.";
    return;
  }

  const errorAbs = Math.abs(data.error);

  container.innerHTML = `
    <p>Target interval: <strong>${data.target} ms</strong></p>
    <p>Your estimate: <strong>${data.actual} ms</strong></p>
    <p>Error: <strong>${data.error} ms</strong> (absolute: ${errorAbs} ms)</p>
    <p class="note">Smaller absolute error means more accurate time perception.</p>
  `;
}

function renderMemoryResults() {
  const container = document.getElementById("memory-results-summary");
  if (!container) return;

  let data = null;
  try {
    data = JSON.parse(localStorage.getItem("adhd_last_memory_session"));
  } catch (e) {
    data = null;
  }

  if (!data || data.type !== "working-memory") {
    container.textContent =
      "No memory task data found. Run the Working Memory task first.";
    return;
  }

  container.innerHTML = `
    <p>Max Span: <strong>${data.maxSpan} digits</strong></p>
    <p>Rounds Played: <strong>${data.rounds}</strong></p>
    <p>Distraction Level: <strong>${data.distractionLevel.toUpperCase()}</strong></p>
    <p class="note">A higher span indicates better working memory capacity.</p>
  `;
}

function renderDualResults() {
  const container = document.getElementById("dual-results-summary");
  if (!container) return;

  let data = null;
  try {
    data = JSON.parse(localStorage.getItem("adhd_last_dual_session"));
  } catch (e) {
    data = null;
  }

  if (!data || data.type !== "dual-task") {
    container.textContent =
      "No dual-task data found. Run the Dual Task module first.";
    return;
  }

  container.innerHTML = `
    <p>Mode: <strong>${data.mode.toUpperCase()}</strong></p>
    <p>Visual Accuracy: <strong>${data.visAccuracy}%</strong></p>
    <p>Audio Accuracy: <strong>${data.audAccuracy}%</strong></p>
    <p>Combined Score: <strong>${data.combined}%</strong></p>
    <p class="note">Compare single-task scores against dual-task to see interference.</p>
  `;
}

renderFocusResults();
renderTimeResults();
renderMemoryResults();
renderDualResults();