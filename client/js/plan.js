import courses from '/data/courses.js';
import {core, humanPhys} from '/data/required.js';
import electives from '/data/electives.js';
import progression from '/data/progression.js';
import { createCourseRow } from "./main.js";

const semestersGrid = document.getElementById('semesters-grid');
if (!semestersGrid) {
    console.error('Semesters grid not found');
}

let semesterCount = 0;
let selectedSlot = null;

// shared function for adding course to selected slot
function addCourseToSelectedSlot(courseCode) {
    if (selectedSlot) {
        const courseData = courses[courseCode];
        if (courseData) {
            selectedSlot.value = `${courseCode} - ${courseData.name}`;
            selectedSlot.classList.remove('selected');
            selectedSlot = null;
        }
    } else {
        alert('Please select a course slot first');
    }
}

function createSemester(semesterName = '') {
    semesterCount++;
    const defaultName = semesterName || `Semester ${semesterCount}`;

    const semesterCard = document.createElement('div');
    semesterCard.className = 'semester-card';
    semesterCard.dataset.semesterId = semesterCount;

    semesterCard.innerHTML = `
        <div class="semester-header">
            <input type="text" 
                   class="semester-title" 
                   value="${defaultName}"
                   placeholder="Semester name">
            <div class="semester-actions">
                <button class="delete-semester" title="Delete">🗑️</button>
            </div>
        </div>
        <div class="course-slots">
            ${createCourseSlots(3)}
        </div>
        <button class="add-course-btn">+ Add Course</button>
    `;

    return semesterCard;
}

function createCourseSlots(count) {
    let slots = '';
    for (let i = 0; i < count; i++) {
        slots += `
            <div class="course-slot-container" data-slot="${i}">
                <input type="text" class="course-slot" placeholder="Type to search">
                <button class="delete-course" title="Remove slot">×</button>
            </div>
        `;
    }
    return slots;
}

function initializeSemesters() {
    const years = ['Freshman', 'Sophomore', 'Junior', 'Senior'];
    const terms = ['Fall', 'Spring'];

    for (let year = 0; year < 4; year++) {
        for (let term = 0; term < 2; term++) {
            const semesterName = `${years[year]} ${terms[term]}`;
            const semester = createSemester(semesterName);
            semestersGrid.appendChild(semester);
        }
    }
}

semestersGrid?.addEventListener('click', (e) => {
    if (e.target.classList.contains('course-slot')) {
        if (selectedSlot) {
            selectedSlot.classList.remove('selected');
        }
        selectedSlot = e.target;
        selectedSlot.classList.add('selected');
        return;
    }

    if (e.target.classList.contains('delete-semester')) {
        const semesterCard = e.target.closest('.semester-card');
        if (confirm('Delete this semester?')) {
            semesterCard.remove();
        }
    }

    if (e.target.classList.contains('delete-course')) {
        const semesterCard = e.target.closest('.semester-card');
        const courseSlotsContainer = semesterCard.querySelector('.course-slots');
        const slots = courseSlotsContainer.querySelectorAll('.course-slot-container');

        if (slots.length > 1) {
            const slotToRemove = e.target.closest('.course-slot-container');
            const slotInput = slotToRemove.querySelector('.course-slot');

            if (slotInput === selectedSlot) {
                selectedSlot = null;
            }

            slotToRemove.remove();
        } else {
            alert('Each semester must have at least one course');
        }
    }

    if (e.target.classList.contains('add-course-btn')) {
        const semesterCard = e.target.closest('.semester-card');
        const courseSlotsContainer = semesterCard.querySelector('.course-slots');

        const newSlot = document.createElement('div');
        newSlot.className = 'course-slot-container';
        newSlot.innerHTML = `
            <input type="text" class="course-slot" placeholder="Type to search">
            <button class="delete-course" title="Remove course">×</button>
        `;

        courseSlotsContainer.appendChild(newSlot);
    }
});

// tab switching
const tabs = document.querySelectorAll('.tab');
const courseLists = document.querySelectorAll('.course-list');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        courseLists.forEach(list => list.classList.remove('active'));

        tab.classList.add('active');
        const targetList = document.getElementById(`${tab.dataset.tab}-courses`);
        if (targetList) {
            targetList.classList.add('active');
        }
    });
});

// add semester button
document.getElementById('add-semester-btn')?.addEventListener('click', () => {
    const semester = createSemester();
    semestersGrid.appendChild(semester);
});

function populateRequiredCourses() {
    const requiredContainer = document.getElementById('required-courses');
    if (!requiredContainer) return;

    requiredContainer.innerHTML = '';

    const sections = [
        { title: 'Core STEM', courses: humanPhys.coreSTEM },
        { title: 'Lower Division', courses: humanPhys.lowerDivision },
        { title: 'Upper Division', courses: humanPhys.upperDivision }
    ];

    sections.forEach(({ title, courses: courseCodes }) => {
        const section = document.createElement('div');
        section.className = 'subsection';

        const header = document.createElement('h4');
        header.textContent = title;
        header.classList.add('collapsed');

        const content = document.createElement('div');
        content.className = 'subsection-content collapsed';

        courseCodes.forEach(code => {
            const row = createCourseRow(code);
            if (row) {
                row.style.cursor = 'pointer';
                row.addEventListener('click', () => addCourseToSelectedSlot(code));
                content.appendChild(row);
            }
        });

        // toggle collapse on click
        header.addEventListener('click', () => {
            header.classList.toggle('collapsed');
            content.classList.toggle('collapsed');
        });

        section.appendChild(header);
        section.appendChild(content);

        requiredContainer.appendChild(section);
    });
}

function populateElectives() {
    const electivesContainer = document.getElementById('electives-courses');
    if (!electivesContainer) return;

    electivesContainer.innerHTML = '';

    electives.forEach(elective => {
        const row = createCourseRow(elective.code);
        if (row) {
            row.style.cursor = 'pointer';
            row.addEventListener('click', () => addCourseToSelectedSlot(elective.code));
            electivesContainer.appendChild(row);
        }
    });
}

function populateSampleProgression() {
    const progressionContainer = document.getElementById('recommended-courses');
    if (!progressionContainer) return;

    progressionContainer.innerHTML = '';

    const years = [
        { title: 'Freshman Year', data: progression.freshman },
        { title: 'Sophomore Year', data: progression.sophomore },
        { title: 'Junior Year', data: progression.junior },
        { title: 'Senior Year', data: progression.senior }
    ];

    years.forEach(({ title, data }) => {
        const section = document.createElement('div');
        section.className = 'subsection';

        const header = document.createElement('h4');
        header.textContent = title;
        header.classList.add('collapsed');

        const content = document.createElement('div');
        content.className = 'subsection-content collapsed';

        // add fall semester
        if (data.fall) {
            const fallLabel = document.createElement('div');
            fallLabel.style.fontWeight = 'bold';
            fallLabel.style.fontSize = '13px';
            fallLabel.style.marginTop = '8px';
            fallLabel.style.marginBottom = '4px';
            fallLabel.textContent = 'Fall';
            content.appendChild(fallLabel);

            data.fall.forEach(courseCode => {
                const row = createCourseRow(courseCode);
                if (row) {
                    row.style.cursor = 'pointer';
                    row.addEventListener('click', () => addCourseToSelectedSlot(courseCode));
                    content.appendChild(row);
                }
            });
        }

        // add spring semester
        if (data.spring) {
            const springLabel = document.createElement('div');
            springLabel.style.fontWeight = 'bold';
            springLabel.style.fontSize = '13px';
            springLabel.style.marginTop = '12px';
            springLabel.style.marginBottom = '4px';
            springLabel.textContent = 'Spring';
            content.appendChild(springLabel);

            data.spring.forEach(courseCode => {
                const row = createCourseRow(courseCode);
                if (row) {
                    row.style.cursor = 'pointer';
                    row.addEventListener('click', () => addCourseToSelectedSlot(courseCode));
                    content.appendChild(row);
                }
            });
        }

        // toggle collapse on click
        header.addEventListener('click', () => {
            header.classList.toggle('collapsed');
            content.classList.toggle('collapsed');
        });

        section.appendChild(header);
        section.appendChild(content);
        progressionContainer.appendChild(section);
    });
}

function collectPlanData() {
    const planName = document.getElementById('plan-name').value || 'Schedule Draft';
    const semesterCards = document.querySelectorAll('.semester-card');

    const semesters = [];

    semesterCards.forEach(card => {
        const semesterName = card.querySelector('.semester-title').value;
        const courseSlots = card.querySelectorAll('.course-slot');

        const courses = [];
        courseSlots.forEach(slot => {
            const value = slot.value.trim();
            if (value) {
                // parse course code & name format
                const match = value.match(/^([A-Z]+\s+\d+)\s*-\s*(.+)$/);
                if (match) {
                    courses.push({
                        courseCode: match[1],
                        courseName: match[2]
                    });
                } else {
                    // just save as-is
                    courses.push({
                        courseCode: value,
                        courseName: ''
                    });
                }
            }
        });

        semesters.push({
            name: semesterName,
            courses: courses
        });
    });

    return { planName, semesters };
}

// save plan
async function savePlan() {
    // get userId from localStorage (stored during login)
    const userId = localStorage.getItem('userId');

    if (!userId) {
        alert('Please log in to save plans');
        window.location.href = '/register';
        return;
    }

    const planData = collectPlanData();

    try {
        const response = await fetch('/api/plans', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                planName: planData.planName,
                semesters: planData.semesters
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert('Plan saved successfully!');
            console.log('Saved plan:', result);
        } else {
            alert('Error saving plan: ' + result.message);
        }
    } catch (error) {
        console.error('Save error:', error);
        alert('Error connecting to server');
    }
}

// event listener for save button
document.getElementById('save-plan-btn')?.addEventListener('click', savePlan);

// initialize
if (semestersGrid) {
    initializeSemesters();
    populateRequiredCourses();
    populateElectives();
    populateSampleProgression();
}