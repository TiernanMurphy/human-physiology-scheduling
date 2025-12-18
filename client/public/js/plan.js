import courses from '/data/courses.js';
import { humanPhys } from '/data/required.js';
import { createCourseRow } from "./main.js";

// generate initial 8 semesters
const semestersGrid = document.getElementById('semesters-grid');
let semesterCount = 0;

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
            ${createCourseSlots(5)}
        </div>
    `;

    return semesterCard;
}

function createCourseSlots(count) {
    let slots = '';
    for (let i = 0; i < count; i++) {
        slots += `
                    <input type="text"
                        class="course-slot"
                        data-slot="${i}"
                        placeholder="+ Add Course">
        `;
    }
    return slots;
}

// initialize with 8 semesters
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

// tab switching
const tabs = document.querySelectorAll('.tab');
const courseLists = document.querySelectorAll('.course-list');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // remove active from all tabs and lists
        tabs.forEach(t => t.classList.remove('active'));
        courseLists.forEach(list => list.classList.remove('active'));

        // add active to clicked tab and corresponding list
        tab.classList.add('active');
        const targetList = document.getElementById(`${tab.dataset.tab}-courses`);
        if (targetList) {
            targetList.classList.add('active');
        }
    });
});

// add semester button
document.getElementById('add-semester-btn').addEventListener('click', () => {
    const semester = createSemester();
    semestersGrid.appendChild(semester);
});

// delete semester (event delegation)
semestersGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-semester')) {
        const semesterCard = e.target.closest('.semester-card');
        if (confirm('Delete this semester?')) {
            semesterCard.remove();
        }
    }
});

// initialize
initializeSemesters();

// populate required courses panel
function populateRequiredCourses() {
    const requiredContainer = document.getElementById('required-courses');

    // clear placeholder content
    requiredContainer.innerHTML = '';

    // core stem section
    const coreStemSection = document.createElement('div');
    coreStemSection.className = 'subsection';
    coreStemSection.innerHTML = '<h4>Core STEM</h4>';
    humanPhys.coreSTEM.forEach(code => {
        const row = createCourseRow(code);
        if (row) coreStemSection.appendChild(row);
    });
    requiredContainer.appendChild(coreStemSection);

    // lower division section
    const lowerDivSection = document.createElement('div');
    lowerDivSection.className = 'subsection';
    lowerDivSection.innerHTML = '<h4>Lower Division</h4>';
    humanPhys.lowerDivision.forEach(code => {
        const row = createCourseRow(code);
        if (row) lowerDivSection.appendChild(row);
    });
    requiredContainer.appendChild(lowerDivSection);

    // upper division section
    const upperDivSection = document.createElement('div');
    upperDivSection.className = 'subsection';
    upperDivSection.innerHTML = '<h4>Upper Division</h4>';
    humanPhys.upperDivision.forEach(code => {
        const row = createCourseRow(code);
        if (row) upperDivSection.appendChild(row);
    });
    requiredContainer.appendChild(upperDivSection);
}

// call it on page load
populateRequiredCourses();