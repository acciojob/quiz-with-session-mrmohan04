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

  // In your Cypress spec file, e.g. cypress/integration/tests/test.spec.js

describe('Quiz App Tests', () => {
  let questions;

  before(() => {
    // Load your fixture or however you get the expected questions data
    cy.fixture('questions').then((q) => {
      questions = q;
    });
  });

  beforeEach(() => {
    cy.visit(baseUrl + "/main.html");  // or whatever page your quiz is on
  });

  it('Checking questions and UI Elements', () => {
    // Instead of div#questions, we look inside form#quiz-form
    cy.get('form#quiz-form').children('div.question')
      .should('have.length', 5);

    cy.get('form#quiz-form').children('div.question').each(($ele, index) => {
      // Check question text
      cy.wrap($ele).find('p').invoke('text')
        .should('equal', questions[index].question);

      // Check there are 4 radio inputs
      cy.wrap($ele).find('input[type="radio"]').should('have.length', 4);

      // Check the value attributes of the inputs match expected choices
      cy.wrap($ele).within(() => {
        cy.get('input[type="radio"]').each((input, i) => {
          expect(input.attr('value')).to.equal(questions[index].choices[i]);
        });
      });
    });

    // Check submit button using your id
    cy.get('button#submit-btn').should('exist');

    // Check the output div (result) is empty initially
    cy.get('div#result').should('be.empty');
  });

  it('Session storage retains selection after refresh', () => {
    // Select some answers
    cy.get('input[name="q1"][value="C"]').check();
    cy.get('input[name="q2"][value="B"]').check();

    // Refresh
    cy.reload();

    // The same should remain checked
    cy.get('input[name="q1"][value="C"]').should('be.checked');
    cy.get('input[name="q2"][value="B"]').should('be.checked');
  });

  it('Submit quiz computes score and stores in localStorage', () => {
    // Answer all questions (some correct, some incorrect as needed for your test)
    cy.get('input[name="q1"][value="C"]').check();
    cy.get('input[name="q2"][value="B"]').check();
    cy.get('input[name="q3"][value="C"]').check();
    cy.get('input[name="q4"][value="A"]').check();
    cy.get('input[name="q5"][value="A"]').check();

    cy.get('button#submit-btn').click();

    // Check displayed score in your result div
    cy.get('div#result')
      .should('have.text', `Your score is 5 out of 5.`);  // adjust expected score

    // Check that localStorage has the correct score
    cy.window().then((win) => {
      expect(win.localStorage.getItem('score')).to.equal('5');
    });
  });
});

});
