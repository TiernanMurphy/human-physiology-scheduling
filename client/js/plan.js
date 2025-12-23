import courses from '/data/courses.js';
import { humanPhys } from '/data/required.js';
import { createCourseRow } from "./main.js";

const semestersGrid = document.getElementById('semesters-grid');
let semesterCount = 0;
let selectedSlot = null;

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
                <input type="text" class="course-slot" placeholder="type to search">
                <button class="delete-course" title="Remove slot">×</button>
            </div>
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

semestersGrid.addEventListener('click', (e) => {
    // remove course from plan
    if (e.target.classList.contains('course-slot')) {
        if (selectedSlot) {
            selectedSlot.classList.remove('selected');
        }

        // set new selection
        selectedSlot = e.target;
        selectedSlot.classList.add('selected');
        return;
    }

    // delete semester from plan
    if (e.target.classList.contains('delete-semester')) {
        const semesterCard = e.target.closest('.semester-card');
        if (confirm('Delete this semester?')) {
            semesterCard.remove();
        }
    }

    // delete individual course
    if (e.target.classList.contains('delete-course')) {
        const semesterCard = e.target.closest('.semester-card');
        const courseSlotsContainer = semesterCard.querySelector('.course-slots');
        const slots = courseSlotsContainer.querySelectorAll('.course-slot-container');

        // must have at least one course per semester
        if (slots.length > 1) {
            const slotToRemove = e.target.closest('.course-slot-container');
            const slotInput = slotToRemove.querySelector('.course-slot');

            // clear selection if deleting selected slot
            if (slotInput === selectedSlot) {
                selectedSlot = null;
            }

            slotToRemove.remove();
        } else {
            alert('Each semester must have at least one course');
        }
    }

    // add course slot
    if (e.target.classList.contains('add-course-btn')) {
        const semesterCard = e.target.closest('.semester-card');
        const courseSlotsContainer = semesterCard.querySelector('.course-slots');

        const newSlot = document.createElement('div');
        newSlot.className = 'course-slot-container';
        newSlot.innerHTML = `
            <input type="text" class="course-slot" placeholder="+ Add Course">
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
document.getElementById('add-semester-btn').addEventListener('click', () => {
    const semester = createSemester();
    semestersGrid.appendChild(semester);
});

function populateRequiredCourses() {
    const requiredContainer = document.getElementById('required-courses');
    requiredContainer.innerHTML = '';

    const sections = [
        { title: 'Core STEM', courses: humanPhys.coreSTEM },
        { title: 'Lower Division', courses: humanPhys.lowerDivision },
        { title: 'Upper Division', courses: humanPhys.upperDivision }
    ];

    sections.forEach(({ title, courses: courseCodes }) => {
        const section = document.createElement('div');
        section.className = 'subsection';
        section.innerHTML = `<h4>${title}</h4>`;

        courseCodes.forEach(code => {
            const row = createCourseRow(code);
            if (row) {
                row.style.cursor = 'pointer';
                row.addEventListener('click', () => {
                    if (selectedSlot) {
                        const courseData = courses[code];
                        if (courseData) {
                            selectedSlot.value = `${code} - ${courseData.name}`;
                            selectedSlot.classList.remove('selected');
                            selectedSlot = null;
                        }
                    } else {
                        alert('Please select a course slot first');
                    }
                });
                section.appendChild(row);
            }
        });
        requiredContainer.appendChild(section);
    });
}

// initialize
initializeSemesters();
populateRequiredCourses();