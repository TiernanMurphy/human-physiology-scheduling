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

    // show/hide password toggle (registration)
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

    // show/hide password toggle (login)
    const showLoginPasswordCheckbox = document.getElementById('show-login-password');
    if (showLoginPasswordCheckbox) {
        showLoginPasswordCheckbox.addEventListener('change', (e) => {
            const passwordField = document.getElementById('login-password');
            const type = e.target.checked ? 'text' : 'password';
            passwordField.type = type;
        });
    }

    // login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Login successful!');
                    console.log('User:', data.user);
                    console.log('Token:', data.token);
                    // TODO: Store token and redirect to dashboard
                } else {
                    alert(data.message || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('Error connecting to server');
            }
        });
    }

    // registration form submission
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', async (e) => {
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

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Registration successful!');
                    console.log('User:', data.user);
                    console.log('Token:', data.token);
                    // TODO: Store token and redirect to dashboard
                    switchScreen('login');
                } else {
                    alert(data.message || 'Registration failed');
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert('Error connecting to server');
            }
        });
    }

    // initialize progress bar
    updateProgressBar();
});