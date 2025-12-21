const startTimeBtn = document.getElementById("start-time-test");
const timeBox = document.getElementById("time-box");
const timeStatus = document.getElementById("time-status");
const timeResults = document.getElementById("time-results");
const tpActualSpan = document.getElementById("tp-actual");
const tpErrorSpan = document.getElementById("tp-error");

let timeTestRunning = false;
let timeStart = null;
const TARGET_INTERVAL = 5000;


function resetTimeUI() {
  timeBox.textContent = 'Press "Start Test" to begin';
  timeStatus.textContent = "";
  timeResults.style.display = "none";
}

function startTimeTest() {
  timeTestRunning = true;
  timeStart = Date.now();
  timeBox.textContent = "Counting... Press SPACE when you think 5 seconds passed.";
  timeStatus.textContent =
    "Test running... focus only on your internal sense of time.";
  timeResults.style.display = "none";
  startTimeBtn.disabled = true;
}

function finishTimeTest() {
  if (!timeTestRunning || timeStart === null) return;
  timeTestRunning = false;
  const now = Date.now();
  const actual = now - timeStart;
  const error = actual - TARGET_INTERVAL;

  tpActualSpan.textContent = actual.toString();
  tpErrorSpan.textContent = error.toString();
  timeResults.style.display = "block";

  timeBox.textContent = "Test complete. You can run it again if you want.";
  timeStatus.textContent =
    "Try comparing your estimate across different days or after distractions.";

  startTimeBtn.disabled = false;

  try {
    localStorage.setItem(
      "adhd_last_time_test",
      JSON.stringify({
        type: "time-perception",
        actual,
        error,
        target: TARGET_INTERVAL,
        timestamp: new Date().toISOString()
      })
    );
  } catch (e) {
    console.warn("Could not save time test result", e);
  }
}

if (startTimeBtn) {
  startTimeBtn.addEventListener("click", () => {
    resetTimeUI();
    startTimeTest();
  });
}

window.addEventListener("keydown", e => {
  if (e.code === "Space" || e.key === " ") {
    if (timeTestRunning) {
      e.preventDefault();
      finishTimeTest();
    }
  }
});


