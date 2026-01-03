// registration screen navigation
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

// survey progress indicator
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

function setUpPasswordToggle(checkboxId, passwordFieldIds) {
    const checkbox = document.getElementById(checkboxId);
    if (checkbox) {
        checkbox.addEventListener('change', (e) => {
            const type = e.target.checked ? 'text' : 'password';
            passwordFieldIds.forEach(fieldId => {
               const field = document.getElementById(fieldId);
               if (field) field.type = type;
            });
        });
    }
}

// helper function for API calls
async function submitAuthForm(endpoint, data, successCallback) {
    try {
        const response = await fetch(`/api/auth/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            console.log('User:', result.user);
            console.log('Token:', result.token);

            // alert(`${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)} successful!`);
            if (successCallback) successCallback(result);
        } else {
            alert(result.message || `${endpoint} failed`);
        }
    } catch (error) {
        console.error(`${endpoint} error:`, error);
        alert('Error connecting to server');
    }
}

// event listeners
document.addEventListener('DOMContentLoaded', () => {
    // screen switching
    document.querySelectorAll('[data-screen]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetScreen = button.dataset.screen;
            switchScreen(targetScreen);

            // reset to first question when entering registration
            if (targetScreen === 'register') {
                showQuestion(1);
            }
        });
    });

    // next question
    document.querySelectorAll('[data-action="next"]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            nextQuestion();
        });
    });

    // previous question
    document.querySelectorAll('[data-action="prev"]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            prevQuestion();
        });
    });

    // registration
    setUpPasswordToggle('show-password', ['student-password', 'password-confirm']);

    // login
    setUpPasswordToggle('show-login-password', ['login-password']);

    // new login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
           e.preventDefault();

           const loginData = {
               email: document.getElementById('login-email').value,
               password: document.getElementById('login-password').value
           };

           await submitAuthForm('login', loginData, (result) => {
               // debugging save plan button
               console.log('Login result:', result);
               console.log('User object:', result.user);
               console.log('User ID:', result.user._id);

               // store userId in localStorage
               localStorage.setItem('userId', result.user.id);
               localStorage.setItem('token', result.token);

               // check for admin redirect
               if (result.user.isAdmin) {
                   window.location.href = '/pages/admin.html';
               } else {
                   window.location.href = '/pages/home.html';
               }
           });
        });
    }

    // new registration form submission
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // ensure passwords match
            const password = document.getElementById('student-password').value;
            const confirmPassword = document.getElementById('password-confirm').value;

            if (password !== confirmPassword) {
                alert("Passwords don't match!");
                return;
            }

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

            await submitAuthForm('register', formData, (result) => {
                localStorage.setItem('userId', result.user.id);
                localStorage.setItem('token', result.token);

                window.location.href = '/pages/home.html';
            });
        });
    }

    // initialize progress bar
    updateProgressBar();
});