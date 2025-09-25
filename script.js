document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quiz-form');
  const submitBtn = document.getElementById('submit-btn');
  const resultDiv = document.getElementById('result');

  const totalQuestions = 5;

  // Correct answers map
  const correctAnswers = {
    q1: 'C',
    q2: 'B',
    q3: 'C',
    q4: 'A',
    q5: 'A'
  };

  // Function to load progress from sessionStorage and set checked radios
  function loadProgress() {
    const progJson = sessionStorage.getItem('progress');
    if (progJson) {
      try {
        const progress = JSON.parse(progJson);
        // progress is expected to be an object { q1: 'A', q2: 'C', ... }
        for (const [qid, value] of Object.entries(progress)) {
          const selector = `input[name="${qid}"][value="${value}"]`;
          const radio = form.querySelector(selector);
          if (radio) {
            radio.checked = true;
          }
        }
      } catch (e) {
        console.error('Error parsing sessionStorage progress', e);
      }
    }
  }

  // Function to save a single answer to sessionStorage
  function saveAnswer(qName, value) {
    let progress = {};
    const existing = sessionStorage.getItem('progress');
    if (existing) {
      try {
        progress = JSON.parse(existing);
      } catch (e) {
        console.error('Error parsing existing progress', e);
        progress = {};
      }
    }
    // update
    progress[qName] = value;
    sessionStorage.setItem('progress', JSON.stringify(progress));
  }

  // When a radio button is changed, save to sessionStorage
  form.addEventListener('change', (event) => {
    const target = event.target;
    if (target.matches('input[type="radio"]')) {
      const qName = target.name;  // e.g., "q1"
      const value = target.value;
      saveAnswer(qName, value);
    }
  });

  // Submit logic
  submitBtn.addEventListener('click', () => {
    // Read progress from sessionStorage
    const progJson = sessionStorage.getItem('progress');
    let progress = {};
    if (progJson) {
      try {
        progress = JSON.parse(progJson);
      } catch (e) {
        console.error('Error parsing progress on submit', e);
        progress = {};
      }
    }

    // Calculate score
    let score = 0;
    for (let i = 1; i <= totalQuestions; i++) {
      const qName = 'q' + i;
      if (progress[qName] && progress[qName] === correctAnswers[qName]) {
        score++;
      }
    }

    // Display result
    resultDiv.textContent = `Your score is ${score} out of ${totalQuestions}.`;

    // Store score in localStorage
    localStorage.setItem('score', score);

    // Optionally you might want to disable further changes or submissions
  });

  // On load: check if there is a stored score already, show it
  function loadStoredScore() {
    const stored = localStorage.getItem('score');
    if (stored !== null) {
      // Make sure resultDiv reflects it
      resultDiv.textContent = `Your score is ${stored} out of ${totalQuestions}.`;
    }
  }

  // Initialize
  loadProgress();
  loadStoredScore();
});
