document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quiz-form');
  const submitBtn = document.getElementById('submit');
  const scoreDiv = document.getElementById('score');
  const totalQuestions = 5;

  const correctAnswers = {
    q1: 'C',
    q2: 'B',
    q3: 'C',
    q4: 'A',
    q5: 'A'
  };

  // Load saved progress from sessionStorage
  function loadProgress() {
    const progJson = sessionStorage.getItem('progress');
    if (progJson) {
      try {
        const progress = JSON.parse(progJson);
        Object.entries(progress).forEach(([qName, value]) => {
          const selector = `input[name="${qName}"][value="${value}"]`;
          const radio = form.querySelector(selector);
          if (radio) {
            radio.checked = true;
          }
        });
      } catch (err) {
        console.error('Error parsing sessionStorage progress:', err);
      }
    }
  }

  // Save an answer into sessionStorage
  function saveAnswer(qName, value) {
    let progress = {};
    const existing = sessionStorage.getItem('progress');
    if (existing) {
      try {
        progress = JSON.parse(existing);
      } catch (err) {
        console.error('Error parsing existing progress:', err);
        progress = {};
      }
    }
    progress[qName] = value;
    sessionStorage.setItem('progress', JSON.stringify(progress));
  }

  // Handle radio changes
  form.addEventListener('change', (event) => {
    const tgt = event.target;
    if (tgt.matches('input[type="radio"]')) {
      saveAnswer(tgt.name, tgt.value);
    }
  });

  // Handle submit
  submitBtn.addEventListener('click', () => {
    const progJson = sessionStorage.getItem('progress');
    let progress = {};
    if (progJson) {
      try {
        progress = JSON.parse(progJson);
      } catch (err) {
        console.error('Error parsing progress on submit:', err);
        progress = {};
      }
    }

    let score = 0;
    for (let i = 1; i <= totalQuestions; i++) {
      const key = 'q' + i;
      if (progress[key] && progress[key] === correctAnswers[key]) {
        score++;
      }
    }

    scoreDiv.textContent = `Your score is ${score} out of ${totalQuestions}.`;
    localStorage.setItem('score', score);
  });

  // Load stored score if present
  function loadStoredScore() {
    const stored = localStorage.getItem('score');
    if (stored !== null) {
      scoreDiv.textContent = `Your score is ${stored} out of ${totalQuestions}.`;
    }
  }

  // Initialize
  loadProgress();
  loadStoredScore();
});
