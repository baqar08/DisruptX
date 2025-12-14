function computeLiveStats(responses) {
  const total = responses.length;
  const correctCount = responses.filter(r => r.correct).length;
  const wrongCount = total - correctCount;

  const rts = responses
    .filter(r => r.reacted && r.reactionTime != null)
    .map(r => r.reactionTime);

  let avg = null;
  if (rts.length > 0) {
    const sum = rts.reduce((a, b) => a + b, 0);
    avg = Math.round(sum / rts.length);
  }

  return { total, correctCount, wrongCount, avgRT: avg };
}

function saveSessionToStorage(summary) {
  try {
    localStorage.setItem("adhd_last_session", JSON.stringify(summary));
  } catch (e) {

  }
}