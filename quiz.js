const questions = [

    {
        question: "What does HTML stand for?",
        answers: [
            { text: "Hyperlinks and Text Markup Language", correct: true },
            { text: "Hyper Text Markup Language", correct: false },
            { text: "Home Tool Markup Language", correct: false },
            { text: "Hyperlink Tool Markup Language", correct: false },
        ]
    },
    {
        question: "Who is making the Web standards?",
        answers: [
            { text: "Google", correct: false },
            { text: "Microsoft", correct: false },
            { text: "The World Wide Web Consortium", correct: true },
            { text: "Mozilla", correct: false },

        ]
    },
    {
        question: "Which HTML attribute is used to define inline styles?",
        answers: [
            { text: "class", correct: false },
            { text: "style", correct: true },
            { text: "styles", correct: false },
            { text: "font", correct: false },

        ]
    },
    {
        question: "Inside which HTML element do we put the JavaScript?",
        answers: [
            { text: "&ltjavascript&gt", correct: false },
            { text: "&ltscripting&gt", correct: false },
            { text: "&ltjs&gt", correct: false },
            { text: "&ltscript&gt", correct: true },
        ]
    }
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-button");
const nextButton = document.getElementById("next-btn");
const backButton = document.getElementById("back-btn");
const timerElement = document.getElementById("timer");
let currentQuestionIndex = 0;
let score = 0;
let timer;
let startTime;
const userAnswers = []; // Array to store user answers
const timeLimit = 5;

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    userAnswers.length = 0; // Reset user answers
    nextButton.innerHTML = "Next";
    backButton.style.display = "none";
    startTime = new Date(); // Set the start time
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    startTimer();

    const selectedAnswerIndex = userAnswers[currentQuestionIndex];

    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);

        if (hasAnswered(currentQuestionIndex)) {
            button.style.cursor = "not-allowed";

            // Apply correct or incorrect styling for the selected answer
            if (index === selectedAnswerIndex) {
                const isCorrect = answer.correct;
                if (isCorrect) {
                    button.classList.add("correct");
                } else {
                    button.classList.add("incorrect");
                }
            }
        }

        button.addEventListener("click", () => selectAnswer(index));
    });
}

function resetState() {
    clearInterval(timer);
    nextButton.style.display = "block";
    backButton.style.display = "block";
    timerElement.style.display = "block";
    timerElement.textContent = timeLimit;

    // Enable answer buttons
    Array.from(answerButtons.children).forEach(button => {
        button.disabled = false;
        button.classList.remove("correct", "incorrect", "selected");
    });

    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}



function resetState() {
    clearInterval(timer);
    nextButton.style.display = "block";
    backButton.style.display = "block";
    timerElement.style.display = "block";
    timerElement.textContent = timeLimit;

    // Enable answer buttons
    Array.from(answerButtons.children).forEach(button => {
        button.disabled = false;
        button.classList.remove("correct", "incorrect");
    });

    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function startTimer() {
    let timeRemaining = timeLimit;

    timer = setInterval(() => {
        if (timeRemaining <= 0) {
            clearInterval(timer);
            disableAnswerButtons();
            handleNextButton();
        }

        timerElement.textContent = `Time Left: ${timeRemaining}s`;
        timeRemaining--;
    }, 1000);
}

function disableAnswerButtons() {
    Array.from(answerButtons.children).forEach(button => {
        button.disabled = true;
    });
}

function selectAnswer(answerIndex) {
    if (!hasAnswered(currentQuestionIndex)) {
        userAnswers[currentQuestionIndex] = answerIndex;
        const selectedBtn = answerButtons.children[answerIndex];
        const isCorrect = questions[currentQuestionIndex].answers[answerIndex].correct;

        if (isCorrect) {
            selectedBtn.classList.add("correct");
            score++;
        } else {
            selectedBtn.classList.add("incorrect");
        }

        disableAnswerButtons();
        nextButton.style.display = "block";
        backButton.style.display = "block";
    }
}

function hasAnswered(questionIndex) {
    return userAnswers[questionIndex] !== undefined;
}


function showScore() {
    resetState();
    timerElement.style.display = "none";

    // Calculate total time consumed
    const endTime = new Date();
    const elapsedTime = (endTime - startTime) / 1000; // Calculate elapsed time in seconds

    // Display score and total time
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!<br><br> You solved this quiz in: ${elapsedTime.toFixed(2)} seconds`;

    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";
    backButton.style.display = "none";
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

function handleBackButton() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
        disableAnswerButtons(); // Disable buttons on going back

        if (userAnswers[currentQuestionIndex] !== undefined) {
            const selectedBtn = answerButtons.children[userAnswers[currentQuestionIndex]];
            selectedBtn.disabled = true;
        }
    } else {
        alert("You are at the first question.");
    }
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        startQuiz();
    }
});

backButton.addEventListener("click", handleBackButton);

startQuiz();