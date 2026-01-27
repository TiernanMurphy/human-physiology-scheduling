import courses from '/data/courses.js';
import { humanPhys } from '/data/required.js';
import electives from '/data/electives.js';
import progression from '/data/progression.js';
import { createReferenceRow } from "./main.js";

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
            ${createCourseSlots(5)}
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
    console.log('Required container:', requiredContainer);
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
            const row = createReferenceRow(code);
            if (row) {
                row.style.cursor = 'pointer';
                row.addEventListener('click', () => addCourseToSelectedSlot(code));
                content.appendChild(row);
            }
        });

        // toggle collapse on click
        header.addEventListener('click', () => {
            console.log('Header clicked!', title);
            e.stopPropagation();
            header.classList.toggle('collapsed');
            content.classList.toggle('collapsed');
        });

        section.appendChild(header);
        section.appendChild(content);

        requiredContainer.appendChild(section);
    });

    console.log("required courses populated");
}

function populateElectives() {
    const electivesContainer = document.getElementById('electives-courses');
    if (!electivesContainer) return;

    electivesContainer.innerHTML = '';

    electives.forEach(elective => {
        const row = createReferenceRow(elective.code);
        if (row) {
            row.style.cursor = 'pointer';
            row.addEventListener('click', () => addCourseToSelectedSlot(elective.code));
            electivesContainer.appendChild(row);
        }
    });
}

function populateSampleProgression() {
    const progressionContainer = document.getElementById('recommended-courses');
    console.log('Sample container:', progressionContainer);
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
                const row = createReferenceRow(courseCode);
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
                const row = createReferenceRow(courseCode);
                if (row) {
                    row.style.cursor = 'pointer';
                    row.addEventListener('click', () => addCourseToSelectedSlot(courseCode));
                    content.appendChild(row);
                }
            });
        }

        // toggle collapse on click
        header.addEventListener('click', () => {
            console.log('Header clicked!', title);
            e.stopPropagation();
            header.classList.toggle('collapsed');
            content.classList.toggle('collapsed');
        });

        section.appendChild(header);
        section.appendChild(content);
        progressionContainer.appendChild(section);
    });

    console.log('Required courses populated');
}

// autocomplete functionality for course slots
function setupCourseAutocomplete() {
    let currentDropdown = null;

    // event delegation for all course slots
    semestersGrid.addEventListener('input', (e) => {
        if (e.target.classList.contains('course-slot')) {
            const input = e.target;
            const searchTerm = input.value.trim().toLowerCase();

            // remove old dropdown if exists
            if (currentDropdown) {
                currentDropdown.remove();
                currentDropdown = null;
            }

            // don't show dropdown if input is too short or already selected
            if (searchTerm.length < 2 || input.value.includes(' - ')) {
                return;
            }

            // search for matching courses
            const matches = Object.entries(courses)
                .filter(([code, data]) => {
                    return code.toLowerCase().includes(searchTerm) ||
                        data.name.toLowerCase().includes(searchTerm);
                })
                .slice(0, 8);  // limit to 8 results

            if (matches.length > 0) {
                currentDropdown = createDropdown(matches, input);
            }
        }
    });

    // close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (currentDropdown && !e.target.classList.contains('course-slot') && !e.target.classList.contains('autocomplete-item')) {
            currentDropdown.remove();
            currentDropdown = null;
        }
    });
}

function createDropdown(matches, inputElement) {
    const dropdown = document.createElement('div');
    dropdown.className = 'autocomplete-dropdown';

    matches.forEach(([code, data]) => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.innerHTML = `
            <span class="autocomplete-code">${code}</span>
            <span class="autocomplete-name">${data.name}</span>
        `;

        item.addEventListener('click', () => {
            inputElement.value = `${code} - ${data.name}`;
            dropdown.remove();
            inputElement.classList.remove('selected');
            selectedSlot = null;
        });

        dropdown.appendChild(item);
    });

    // position dropdown below input
    const rect = inputElement.getBoundingClientRect();
    dropdown.style.position = 'absolute';
    dropdown.style.top = `${rect.bottom + window.scrollY}px`;
    dropdown.style.left = `${rect.left + window.scrollX}px`;
    dropdown.style.width = `${rect.width}px`;

    document.body.appendChild(dropdown);
    return dropdown;
}

// get plan ID from URL if present
function getPlanIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('planId');
}

// load an existing plan
async function loadExistingPlan(planId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/plans/${planId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const plan = await response.json();

        if (!response.ok) {
            alert('Error loading plan');
            return;
        }

        // set plan name
        document.getElementById('plan-name').value = plan.planName;

        // clear existing semesters
        semestersGrid.innerHTML = '';
        semesterCount = 0;

        // load semesters from plan
        plan.semesters.forEach(semester => {
            const semesterCard = createSemester(semester.name);
            semestersGrid.appendChild(semesterCard);

            // load courses into this semester
            const courseSlots = semesterCard.querySelectorAll('.course-slot');
            semester.courses.forEach((course, index) => {
                if (courseSlots[index]) {
                    courseSlots[index].value = `${course.courseCode} - ${course.courseName}`;
                } else {
                    // need to add more slots
                    const courseSlotsContainer = semesterCard.querySelector('.course-slots');
                    const newSlot = document.createElement('div');
                    newSlot.className = 'course-slot-container';
                    newSlot.innerHTML = `
                        <input type="text" class="course-slot" placeholder="Type to search" value="${course.courseCode} - ${course.courseName}">
                        <button class="delete-course" title="Remove course">×</button>
                    `;
                    courseSlotsContainer.appendChild(newSlot);
                }
            });
        });

        console.log('Plan loaded successfully');

    } catch (error) {
        console.error('Error loading plan:', error);
        alert('Error loading plan');
    }
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
        window.location.href = '/';
        return;
    }

    const planData = collectPlanData();

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/plans', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
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

document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.getElementById('toggle-sidebar-btn');
    const referenceCard = document.getElementById('reference-card');

    if (toggleBtn && referenceCard) {
        toggleBtn.addEventListener('click', () => {
            const isHidden = referenceCard.classList.toggle('hidden');
            toggleBtn.textContent = isHidden ? 'Show' : 'Hide';
        });
    }
});

// initialize
if (semestersGrid) {
    const planId = getPlanIdFromURL();

    if (planId) {
        loadExistingPlan(planId);
    } else {
        // start with empty semesters
        initializeSemesters();
    }

    // always populate the reference sections
    populateRequiredCourses();
    populateElectives();
    populateSampleProgression();
    setupCourseAutocomplete();
}