const distractionLayer = document.getElementById("distraction-layer");

const DISTRACTION_MESSAGES = [
  "New message!",
  "Battery low",
  "Breaking news!",
  "Friend is typing…",
  "New notification",
  "Sale ending soon!",
  "Reminder: assignment due",
  "Update available"
];

let distractionIntervalId = null;

function spawnDistraction() {
  if (!distractionLayer) return;
  const div = document.createElement("div");
  div.className = "distraction";
  div.textContent =
    DISTRACTION_MESSAGES[
    Math.floor(Math.random() * DISTRACTION_MESSAGES.length)
    ];

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const x = Math.random() * (viewportWidth - 150);
  const y = Math.random() * (viewportHeight - 60) + 60;

  div.style.left = `${x}px`;
  div.style.top = `${y}px`;

  distractionLayer.appendChild(div);

  setTimeout(() => {
    if (div.parentNode === distractionLayer) {
      distractionLayer.removeChild(div);
    }
  }, 3800);
}

function startDistractions(level) {
  stopDistractions();
  let interval;
  if (level === "low") {
    interval = 3000;
  } else if (level === "high") {
    interval = 1000;
  } else {
    interval = 4000;
  }
  distractionIntervalId = setInterval(spawnDistraction, interval);
}

function stopDistractions() {
  if (distractionIntervalId) {
    clearInterval(distractionIntervalId);
    distractionIntervalId = null;
  }
  if (distractionLayer) {
    distractionLayer.innerHTML = "";
  }
}

