// screen navigation
function switchScreen(screenId) {
    // hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // show the target screen
    const targetScreen = document.getElementById(`${screenId}-screen`);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

// survey navigation
let currentQuestion = 1;
const totalQuestions = 9;

function updateProgressBar() {
    const progress = (currentQuestion / totalQuestions) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('current-question').textContent = currentQuestion;
    document.getElementById('total-questions').textContent = totalQuestions;
}

function showQuestion(questionNumber) {
    // hide all questions
    document.querySelectorAll('.question-slide').forEach(slide => {
        slide.classList.remove('active');
    });

    // show target question
    const targetQuestion = document.querySelector(`[data-question="${questionNumber}"]`);
    if (targetQuestion) {
        targetQuestion.classList.add('active');
        currentQuestion = questionNumber;
        updateProgressBar();
    }
}

function nextQuestion() {
    if (currentQuestion < totalQuestions) {
        showQuestion(currentQuestion + 1);
    }
}

function prevQuestion() {
    if (currentQuestion > 1) {
        showQuestion(currentQuestion - 1);
    }
}

// event listeners
document.addEventListener('DOMContentLoaded', () => {
    // screen switching buttons
    document.querySelectorAll('[data-screen]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetScreen = button.dataset.screen;
            switchScreen(targetScreen);

            // reset to first question when entering register screen
            if (targetScreen === 'register') {
                showQuestion(1);
            }
        });
    });

    // survey navigation buttons
    document.querySelectorAll('[data-action="next"]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            nextQuestion();
        });
    });

    document.querySelectorAll('[data-action="prev"]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            prevQuestion();
        });
    });

    // show/hide password toggle
    const showPasswordCheckbox = document.getElementById('show-password');
    if (showPasswordCheckbox) {
        showPasswordCheckbox.addEventListener('change', (e) => {
            const passwordField = document.getElementById('student-password');
            const confirmField = document.getElementById('password-confirm');
            const type = e.target.checked ? 'text' : 'password';
            passwordField.type = type;
            confirmField.type = type;
        });
    }

    // login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            console.log('Login attempt:', { email, password });
            // TODO: Implement actual login logic
            alert('Login functionality coming soon!');
        });
    }

    // registration form submission
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // collect all form data
            const formData = {
                name: document.getElementById('student-name').value,
                email: document.getElementById('student-email').value,
                password: document.getElementById('student-password').value,
                major: document.getElementById('student-major').value,
                minor: document.getElementById('student-minor').value,
                abroad: document.querySelector('input[name="abroad"]:checked').value,
                career: document.getElementById('student-career').value,
                clubs: document.getElementById('student-clubs').value,
                additional: document.getElementById('student-additional').value
            };

            console.log('Registration data:', formData);
            // TODO: Implement actual registration logic
            alert('Registration successful! (Data logged to console)');
        });
    }

    // initialize progress bar
    updateProgressBar();
});