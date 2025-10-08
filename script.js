document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quiz-form');
  const submitBtn = document.getElementById('submit');
  const scoreDiv = document.getElementById('score');
  const totalQuestions = 5;
  const correctAnswers = { q1: 'C', q2: 'B', q3: 'C', q4: 'A', q5: 'A' };

  // Load existing answers from sessionStorage
  function loadProgress() {
    const progJson = sessionStorage.getItem('progress');
    if (progJson) {
      try {
        const progress = JSON.parse(progJson);
        Object.entries(progress).forEach(([qName, value]) => {
          const radio = form.querySelector(`input[name="${qName}"][value="${value}"]`);
          if (radio) radio.checked = true;
        });
      } catch (err) { console.error('Error parsing progress:', err); }
    }
  }

  // Save answer to sessionStorage
  function saveAnswer(qName, value) {
    let progress = {};
    try {
      progress = JSON.parse(sessionStorage.getItem('progress')) || {};
    } catch {}
    progress[qName] = value;
    sessionStorage.setItem('progress', JSON.stringify(progress));
  }

  // Event listener for radio changes
  form.addEventListener('change', (e) => {
    if (e.target.type === 'radio') {
      saveAnswer(e.target.name, e.target.value);
    }
  });

  // Calculate score and store in localStorage
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let score = 0;
    let progress = {};
    try {
      progress = JSON.parse(sessionStorage.getItem('progress')) || {};
    } catch {}
    Object.entries(correctAnswers).forEach(([qName, right]) => {
      if (progress[qName] && progress[qName] === right) score++;
    });
    localStorage.setItem('score', score);
    scoreDiv.textContent = `Your score is ${score} out of ${totalQuestions}.`;
  });

  // Show last score if present on page load
  const lastScore = localStorage.getItem('score');
  if (lastScore !== null) {
    scoreDiv.textContent = `Your score is ${lastScore} out of ${totalQuestions}.`;
  }

  loadProgress();
});
