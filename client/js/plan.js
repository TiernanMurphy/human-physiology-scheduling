import courses from '/data/courses.js';
import { humanPhys, core } from '/data/required.js';
import electives from '/data/electives.js';
import progression from '/data/progression.js';
import { createReferenceRow } from "./main.js";
import recommended from "../../data/recommended.js";

const semestersGrid = document.getElementById('semesters-grid');
if (!semestersGrid) {
    console.error('Semesters grid not found');
}

let semesterCount = 0;
let selectedSlot = null;

// shared function for adding course to selected slot
function addCourseToSelectedSlot(courseCode) {
    if (!selectedSlot) return
    const courseData = courses[courseCode];
    if (courseData) {
        const creditText = courseData.credits === 1 ? 'credit' : 'credits';
        selectedSlot.value = `${courseCode}  -  ${courseData.name}  (${courseData.credits} ${creditText})`;
        selectedSlot.classList.remove('selected');
        selectedSlot = null;
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
                <input type="text" class="course-slot" placeholder="Type or search">
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
        {
            title: 'Human Physiology Required Courses',
            subsections: [
                { title: 'Core STEM', courses: humanPhys.coreSTEM },
                { title: 'Lower Division', courses: humanPhys.lowerDivision },
                { title: 'Upper Division', courses: humanPhys.upperDivision }
            ]
        },
        {
            title: "GU Core Requirements (doesn't include those met by HPHY requirements)",
            subsections: [
                { title: 'Year 1', courses: core.year1 },
                { title: 'Year 2', courses: core.year2 },
                { title: 'Year 3', courses: core.year3 },
                { title: 'Year 4', courses: core.year4 }
            ]
        }
    ];

    sections.forEach(({ title, subsections }) => {
        const section = document.createElement('div');
        section.className = 'subsection';

        const header = document.createElement('h4');
        header.textContent = title;
        header.classList.add('collapsed');

        const sectionContent = document.createElement('div');
        sectionContent.className = 'subsection-content collapsed';

        // Loop over each subsection within this section
        subsections.forEach(({ title: subTitle, courses }) => {
            const subsection = document.createElement('div');
            subsection.className = 'subsection';

            const subHeader = document.createElement('h6');
            subHeader.textContent = subTitle;

            const subContent = document.createElement('div');
            subContent.className = 'subsection-content';

            // Loop over each course code in this subsection
            courses.forEach(code => {
                const row = createReferenceRow(code);
                if (row) {
                    row.style.cursor = 'pointer';
                    row.addEventListener('click', () => addCourseToSelectedSlot(code));
                    subContent.appendChild(row);
                }
            });

            // Toggle collapse for subsection
            subHeader.addEventListener('click', (e) => {
                e.stopPropagation();
                subHeader.classList.toggle('collapsed');
                subContent.classList.toggle('collapsed');
            });

            subsection.appendChild(subHeader);
            subsection.appendChild(subContent);
            sectionContent.appendChild(subsection);
        });

        // Toggle collapse for section
        header.addEventListener('click', (e) => {
            e.stopPropagation();
            header.toggle('collapsed');
            sectionContent.classList.toggle('collapsed');
        });

        section.appendChild(header);
        section.appendChild(sectionContent);
        requiredContainer.appendChild(section);
    });

    console.log("required courses populated");
}

function populateSampleProgression() {
    const progressionContainer = document.getElementById('recommended-courses');
    if (!progressionContainer) return;

    const semesters = [
        { title: 'Freshman Fall', courses: progression.freshman.fall },
        { title: 'Freshman Spring', courses: progression.freshman.spring },
        { title: 'Sophomore Fall', courses: progression.sophomore.fall },
        { title: 'Sophomore Spring', courses: progression.sophomore.spring },
        { title: 'Junior Fall', courses: progression.junior.fall },
        { title: 'Junior Spring', courses: progression.junior.spring },
        { title: 'Senior Fall', courses: progression.senior.fall },
        { title: 'Senior Spring', courses: progression.senior.spring },
    ];

    progressionContainer.innerHTML = '<div id="recommended" class="course-content">\n' +
        '                <div class="career-path-selector">\n' +
        '                    <label for="career-path">Select a career path:</label>\n' +
        '                    <select id="career-path">\n' +
        '                        <option value="">-- Select a path --</option>\n' +
        '                        <option value="undecided">Undecided</option>\n' +
        '                        <option value="medicine">Medicine or Osteopathy</option>\n' +
        '                        <option value="physicianAssistant">Physician Assistant</option>\n' +
        '                        <option value="dental">Dental</option>\n' +
        '                        <option value="physicalTherapy">Physical Therapy</option>\n' +
        '                        <option value="occupationalTherapy">Occupational Therapy</option>\n' +
        '                        <option value="pharmacy">Pharmacy</option>\n' +
        '                        <option value="optometry">Optometry</option>\n' +
        '                    </select>\n' +
        '                </div>\n' +
        '            </div>';

    const careerPath = document.getElementById('career-path');

    // container for content shown after selection
    const courseworkContainer = document.createElement('div');
    courseworkContainer.id = 'coursework-container';
    progressionContainer.appendChild(courseworkContainer);

    // listen for career path selections
    careerPath.addEventListener('change', (e) => {
        const selectedPath = e.target.value;

        if (!selectedPath) {
            courseworkContainer.innerHTML = '';
            return;
        }

        // add all semesters
        semesters.forEach(( { title, courses }) => {
           const semesterHeader = document.createElement('div');
           semesterHeader.textContent = title;
           semesterHeader.className = 'subsection';
           courseworkContainer.appendChild(semesterHeader);

           const content = document.createElement('div');
           courses.forEach((course) => {
              const row = createReferenceRow(course);
              if (row) {
                  content.appendChild(row);
              }
           });

           courseworkContainer.appendChild(content);
        });
    });
}

function populateRecommendedCourses() {
    // pre-selection container
    const container = document.getElementById('recommended2-courses');
    if (!container) return;

    container.innerHTML = '<div id="recommended" class="course-content">\n' +
        '                <div class="career-path-selector">\n' +
        '                    <label for="career-path">Select a career path:</label>\n' +
        '                    <select id="career-path2">\n' +
        '                        <option value="">-- Select a path --</option>\n' +
        '                        <option value="medicine">Medicine or Osteopathy</option>\n' +
        '                        <option value="physician_assistant">Physician Assistant</option>\n' +
        '                        <option value="dental">Dental</option>\n' +
        '                        <option value="physical_therapy">Physical Therapy</option>\n' +
        '                        <option value="occupational_therapy">Occupational Therapy</option>\n' +
        '                        <option value="pharmacy">Pharmacy</option>\n' +
        '                        <option value="optometry">Optometry</option>\n' +
        '                    </select>\n' +
        '                </div>\n' +
        '            </div>';

    const careerPath = document.getElementById('career-path2');

    // container for content shown after selection
    const courseworkContainer = document.createElement('div');
    courseworkContainer.id = 'coursework-container2';
    container.appendChild(courseworkContainer);

    careerPath.addEventListener('change', function(e) {
       const chosenPath = e.target.value;
       courseworkContainer.innerHTML = '';

       const coursework = recommended[chosenPath];

       coursework.forEach(course => {
           const row = createReferenceRow(course);
           courseworkContainer.appendChild(row);
       });
    });
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
    const referenceSection = document.querySelector('.reference-section');
    const semestersGrid = document.getElementById('semesters-grid');

    toggleBtn.addEventListener('click', () => {
        // Toggle hidden class on reference section
        referenceSection.classList.toggle('hidden');

        // Toggle full-width class on semesters grid
        semestersGrid.classList.toggle('full-width');

        // Update button text
        const isHidden = referenceSection.classList.contains('hidden');
        toggleBtn.textContent = isHidden ? 'Show Guide' : 'Hide';
    });
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
    populateSampleProgression();
    populateRecommendedCourses();
    populateElectives();
    setupCourseAutocomplete();
}
