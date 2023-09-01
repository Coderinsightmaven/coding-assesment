const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const optionButtons = document.getElementById("option-buttons");
const timerElement = document.getElementById("timer");
const correctCountElement = document.getElementById("correct-count");
const startButton = document.getElementById("start-btn");
const viewResultsButton = document.getElementById("view-results-btn");
const pastResultsSection = document.getElementById("past-results");
const resultsList = document.getElementById("results-list");

let currentQuestionIndex = 0;
let timeLeft = 60;
let correctAnswers = 0;
let timerInterval;

startButton.addEventListener("click", startQuiz);
viewResultsButton.addEventListener("click", showPastResults);

const questions = [
  {
    question: "What does 'JS' stand for?",
    options: ["JavaScript", "JavaSyntax", "JustScripting", "JointString"],
    correctAnswer: "JavaScript",
  },
  {
    question: "Which keyword is used to declare a variable in JavaScript?",
    options: ["variable", "var", "let", "const"],
    correctAnswer: "var",
  },
];

function startQuiz() {
  startButton.classList.add("hide");
  viewResultsButton.classList.add("hide");
  questionContainer.classList.remove("hide");
  correctCountElement.classList.add("hide");
  startButton.disabled = true;
  currentQuestionIndex = 0;
  timeLeft = 60;
  correctAnswers = 0;
  showQuestion(questions[currentQuestionIndex]);
  startTimer(); // Start the timer after showing the first question
}

function startTimer() {
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timerElement.textContent = `Time left: ${timeLeft} seconds`;
  } else {
    clearInterval(timerInterval);
    timerElement.textContent = "Time's up!";
    showNextQuestion();
  }
}

function showQuestion(question) {
  questionElement.innerText = question.question;
  optionButtons.innerHTML = "";

  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.innerText = option;
    button.classList.add("option-btn");
    button.addEventListener("click", () =>
      selectOption(option, question.correctAnswer)
    );
    optionButtons.appendChild(button);
  });
}

function selectOption(selectedOption, correctAnswer) {
  clearInterval(timerInterval);

  if (selectedOption === correctAnswer) {
    correctAnswers++;
  } else {
    timeLeft -= 10; // Subtract 10 seconds for incorrect answers
    if (timeLeft < 0) {
      timeLeft = 0;
    }
  }

  showNextQuestion();
}

function showNextQuestion() {
  clearInterval(timerInterval); // Clear the timer interval before showing the next question
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion(questions[currentQuestionIndex]);
    startTimer();
  } else {
    questionContainer.innerHTML = "<h2>Quiz Completed!</h2>";
    showResults();
  }
}

function showResults() {
  correctCountElement.textContent = `You got ${correctAnswers} questions right out of ${questions.length}.`;
  correctCountElement.classList.remove("hide");

  // Store the quiz result in local storage
  const initials = prompt("Enter your initials:");
  const score = correctAnswers;
  const result = { initials, score };

  const pastResults = JSON.parse(localStorage.getItem("pastResults")) || [];
  pastResults.push(result);
  localStorage.setItem("pastResults", JSON.stringify(pastResults));

  viewResultsButton.classList.remove("hide"); // Show the Past Results button
}

function showPastResults() {
  const pastResults = JSON.parse(localStorage.getItem("pastResults")) || [];

  resultsList.innerHTML = "";
  pastResults.forEach((result, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${index + 1}. Initials: ${
      result.initials
    }, Score: ${result.score}`;
    resultsList.appendChild(listItem);
  });

  pastResultsSection.classList.remove("hide");
}
