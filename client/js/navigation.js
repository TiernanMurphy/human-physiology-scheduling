document.addEventListener('DOMContentLoaded', () => {
    initScreenNavigation();
    initSurveyNavigation();
});

// handle main screen navigation (home, login, register)
function initScreenNavigation() {
    const buttons = document.querySelectorAll('[data-screen]');

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetScreen = button.getAttribute('data-screen');
            navigateToScreen(targetScreen);
        });
    });
}

function navigateToScreen(screenName) {
    // hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // show target screen
    const targetScreen = document.getElementById(`${screenName}-screen`);
    if (targetScreen) {
        targetScreen.classList.add('active');
        focusFirstInput(targetScreen);
    }
}

// handle registration survey navigation
function initSurveyNavigation() {
    handleSurveyButtons();
    handleEnterKeyNavigation();
}

function handleSurveyButtons() {
    const surveyButtons = document.querySelectorAll('[data-action="next"], [data-action="prev"]');
    surveyButtons.forEach(button => {
        button.addEventListener('click', () => {
            setTimeout(() => {
                const activeSlide = document.querySelector('.question-slide.active');
                if (activeSlide) {
                    focusFirstInput(activeSlide);
                }
            }, 100);
        });
    });
}

function handleEnterKeyNavigation() {
    const registrationForm = document.getElementById('registration-form');
    if (!registrationForm) return;

    registrationForm.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            const activeSlide = registrationForm.querySelector('.question-slide.active');
            if (!activeSlide) return;

            const textarea = activeSlide.querySelector('textarea');

            // allow Enter in textareas for multi-line input
            if (textarea && document.activeElement === textarea) {
                return;
            }

            e.preventDefault();

            // find and click the Next/Done button
            const nextButton = activeSlide.querySelector('[data-action="next"], button[type="submit"]');
            if (nextButton) {
                nextButton.click();
            }
        }
    });
}

// helper function to focus first input in a container
function focusFirstInput(container) {
    setTimeout(() => {
        const input = container.querySelector('input, textarea, select');
        if (input && input.type !== 'radio' && input.type !== 'checkbox') {
            input.focus();
        }
    }, 100);
}