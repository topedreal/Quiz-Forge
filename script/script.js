const questions = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "Berlin", "Madrid", "Rome"],
    answer: 0,
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: 1,
  },
  {
    question: "What is H2O commonly known as?",
    options: ["Hydrogen", "Oxygen", "Water", "Salt"],
    answer: 2,
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: [
      "Charles Dickens",
      "William Shakespeare",
      "Mark Twain",
      "Jane Austen",
    ],
    answer: 1,
  },
  {
    question: "What is 9 x 9?",
    options: ["81", "72", "99", "90"],
    answer: 0,
  },
  {
    question: "Which instrument has 88 keys?",
    options: ["Guitar", "Violin", "Piano", "Flute"],
    answer: 2,
  },
  {
    question: "Which language is primarily used for web pages?",
    options: ["Python", "C++", "HTML", "Java"],
    answer: 2,
  },
  {
    question: "Which animal is known as the 'King of the Jungle'?",
    options: ["Lion", "Tiger", "Elephant", "Gorilla"],
    answer: 0,
  },
  {
    question: "What color do you get by mixing blue and yellow?",
    options: ["Green", "Purple", "Orange", "Brown"],
    answer: 0,
  },
  {
    question: "What does CPU stand for?",
    options: [
      "Central Process Unit",
      "Central Processing Unit",
      "Computer Processing Unit",
      "Central Peripheral Unit",
    ],
    answer: 1,
  },
];

let currentQuestionIndex = 0;
const userAnswers = new Array(questions.length).fill(null);

const questionCounter = document.getElementById("question-counter");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const resultDiv = document.getElementById("result");

// ✅ Render Question
function renderQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionText.textContent = currentQuestion.question;

  optionsContainer.innerHTML = "";

  currentQuestion.options.forEach((option, index) => {
    const optionId = `option${index}`;
    const checked =
      userAnswers[currentQuestionIndex] === index ? "checked" : "";

    optionsContainer.innerHTML += `
      <div class="form-check">
        <input class="form-check-input" type="radio" name="option" id="${optionId}" value="${index}" ${checked}>
        <label class="form-check-label option-label" for="${optionId}">
          ${option}
        </label>
      </div>
    `;
  });

  prevBtn.disabled = currentQuestionIndex === 0;
  nextBtn.textContent =
    currentQuestionIndex === questions.length - 1 ? "Submit" : "Next";
  resultDiv.style.display = "none";
  restartBtn.style.display = "none"; // Hide restart during quiz
}

// ✅ Select Answer
optionsContainer.addEventListener("change", (e) => {
  if (e.target.name === "option") {
    userAnswers[currentQuestionIndex] = parseInt(e.target.value);
  }
});

// Make entire option block clickable (not just the radio input)
optionsContainer.addEventListener("click", (e) => {
  const optionBlock = e.target.closest(".form-check");
  if (!optionBlock) return;

  const input = optionBlock.querySelector('input[type="radio"][name="option"]');
  if (!input) return;

  // If user clicked the already-checked input, do nothing
  if (input.checked && e.target === input) return;

  input.checked = true;
  // update stored answer and ensure change listeners fire
  userAnswers[currentQuestionIndex] = parseInt(input.value);
  input.dispatchEvent(new Event("change", { bubbles: true }));
});

// ✅ Prev Button
prevBtn.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion();
  }
});

// ✅ Next/Submit Button
nextBtn.addEventListener("click", () => {
  if (userAnswers[currentQuestionIndex] === null) {
    alert("Please select an answer before continuing.");
    return;
  }

  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    renderQuestion();
  } else {
    showResults();
  }
});

// ✅ Restart Button (runs only when clicked)
restartBtn.addEventListener("click", () => {
  currentQuestionIndex = 0;
  for (let i = 0; i < userAnswers.length; i++) {
    userAnswers[i] = null;
  }

  prevBtn.style.display = "inline-block";
  nextBtn.style.display = "inline-block";
  restartBtn.style.display = "none";
  renderQuestion();
});

// ✅ Show Results
function showResults() {
  let score = 0;
  userAnswers.forEach((answer, idx) => {
    if (answer === questions[idx].answer) score++;
  });

  questionText.textContent = "Quiz Completed!";
  optionsContainer.innerHTML = "";
  prevBtn.style.display = "none";
  nextBtn.style.display = "none";
  restartBtn.style.display = "inline-block";

  resultDiv.style.display = "block";
  resultDiv.innerHTML = `
    <h4>Your Score: ${score} / ${questions.length}</h4>
    <p>${
      score === questions.length
        ? "Excellent! You got them all right!"
        : "Good effort! Try again to improve."
    }</p>
  `;
}

function showResults() {
  let score = 0;
  let resultsHTML = "";

  questions.forEach((question, idx) => {
    const userAnswerIndex = userAnswers[idx];
    const correctAnswerIndex = question.answer;
    const userAnswerText =
      userAnswerIndex !== null
        ? question.options[userAnswerIndex]
        : "No answer";
    const correctAnswerText = question.options[correctAnswerIndex];

    const isCorrect = userAnswerIndex === correctAnswerIndex;
    if (isCorrect) score++;

    // Render each question as an expanded card so answers are always visible
    resultsHTML += `
      <div class="card mb-2" style="background:rgba(255,255,255,0.02); border:1px solid ${
        isCorrect ? "rgba(72,214,182,0.15)" : "rgba(255,123,102,0.15)"
      };">
        <div class="card-body p-3">
          <div class="d-flex align-items-start">
            <div class="me-3">
              <strong class="text-white">Q${idx + 1}</strong>
            </div>
            <div class="flex-grow-1">
              <div class="mb-1"><strong class="text-white">${
                question.question
              }</strong></div>
              <div><small class="text-white">Your answer: <span style="color:${
                isCorrect ? "var(--accent)" : "var(--primary)"
              }">${userAnswerText}</span></small></div>
              <div><small class="text-white" >Correct answer: <span class="fw-bold text-white">${correctAnswerText}</span></small></div>
            </div>
            <div class="ms-3">
              <span class="badge" style="background:${
                isCorrect ? "rgba(72,214,182,0.12)" : "rgba(255,123,102,0.12)"
              }; color:var(--text);">${
      isCorrect ? "Correct" : "Incorrect"
    }</span>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  function completionHeadline(score, total) {
    const pct = Math.round((score / total) * 100);
    if (pct === 100) return "Flawless Victory! 🎯";
    if (pct >= 90) return "Outstanding Work! 🌟";
    if (pct >= 75) return "Great Job! 🙌";
    if (pct >= 50) return "Nice Effort—Keep Going! 👍";
    return "Good Try—Practice Makes Perfect! 💪";
  }

  // After you compute `score`:
  questionText.textContent = completionHeadline(score, questions.length);

  optionsContainer.innerHTML = "";
  prevBtn.style.display = "none";
  nextBtn.style.display = "none";
  restartBtn.style.display = "inline-block";

  resultDiv.style.display = "block";
  resultDiv.innerHTML = `
    <div class="card bg-transparent border-0">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="mb-0 text-white">Your Score: ${score} / ${
    questions.length
  }</h4>
        <div><span class="badge" style="background:var(--primary); color:#07121a; font-weight:700;">${score}</span></div>
      </div>
      <div>${resultsHTML}</div>
      <div class="mt-3 text-white"><p class="mb-0">${
        score === questions.length
          ? "Excellent! You got them all right!"
          : "Good effort! Review each question above and try again."
      }</p></div>
    </div>
  `;

  // Scroll to results for better UX
  resultDiv.scrollIntoView({ behavior: "smooth" });
}
function renderQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionText.textContent = currentQuestion.question;

  // Show current question number out of total
  questionCounter.textContent = `Question ${currentQuestionIndex + 1} / ${
    questions.length
  }`;

  optionsContainer.innerHTML = "";

  currentQuestion.options.forEach((option, index) => {
    const optionId = `option${index}`;
    const checked =
      userAnswers[currentQuestionIndex] === index ? "checked" : "";

    optionsContainer.innerHTML += `
      <div class="form-check">
        <input class="form-check-input" type="radio" name="option" id="${optionId}" value="${index}" ${checked}>
        <label class="form-check-label option-label" for="${optionId}">
          ${option}
        </label>
      </div>
    `;
  });

  prevBtn.disabled = currentQuestionIndex === 0;
  nextBtn.textContent =
    currentQuestionIndex === questions.length - 1 ? "Submit" : "Next";
  resultDiv.style.display = "none";
  restartBtn.style.display = "none"; // Hide restart during quiz
}

// ✅ Initial Load
renderQuestion();
