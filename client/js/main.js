import courses from '/data/courses.js';
import { humanPhys, core } from '/data/required.js';
import progression from '/data/progression.js';
import recommended from '/data/recommended.js';
import courseLinks from '/data/course-links.js';
import { generateSectionPDF } from "./pdf-generator.js";

// show/hide sections
export function toggleSection(sectionId) {
    const content = document.getElementById(sectionId);
    const arrow = content.previousElementSibling.querySelector('.dropdown-arrow');

    const isHidden = content.classList.toggle('hidden');
    arrow.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
}

// applies toggleSection(sectionId) to home.html sections
document.querySelectorAll('.section-header').forEach(header => {
   header.addEventListener('click', () => {
       const sectionId = header.dataset.section;
       toggleSection(sectionId);
   });
});

// toggle subsections (nested dropdowns)
function initializeSubsectionToggles() {
    document.querySelectorAll('.subsection h4').forEach(header => {
        const content = header.nextElementSibling;
        if (content) {
            attachSubsectionToggle(header, content);
        }
    });
}

function attachSubsectionToggle(heading, content) {
    heading.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('collapsed');
        content.classList.toggle('collapsed');
    });
}

// create a course record
export function createCourseRow(courseCode) {
    const courseData = courses[courseCode];

    // return if invalid course code
    if (!courseData) {
        console.warn(`Course data not found for: ${courseCode}`);
        return null;
    }

    // creates course row div
    const row = document.createElement('div');
    row.className = 'course-row';

    let courseCodeHTML;
    let separator = null;

    // split courseCode links if needed
    if (courseCode.includes(' or ')) {
        separator = ' or ';
    } else if (courseCode.includes(' & ')) {
        separator = ' & ';
    }

    if (separator) {
        const codes = courseCode.split(separator).map(c => c.trim());

        const linkedCodes = codes.map(code => {
            const link = courseLinks[code] || '#';
            if (link !== '#') {
                return `<a href="${link}" class="course-code" target="_blank" rel="noopener noreferrer">${code}</a>`;
            } else return code;
        }).join(separator);

        courseCodeHTML = `<div class="course-code-container">${linkedCodes}</div>`;

    } else {
        const link = courseLinks[courseCode] || '#';
        courseCodeHTML = link !== '#'
            ? `<a href="${link}" class="course-code" target="_blank" rel="noopener noreferrer">${courseCode}</a>`
            : `<div class="course-code">${courseCode}</div>`;
    }

    // add html to course row
    row.innerHTML = `
        ${courseCodeHTML}
        <div class="course-name">${courseData.name}</div>
        <div class="course-credits">${courseData.credits} ${courseData.credits === 1 ? 'credit' : 'credits'}</div>    
    `;

    return row;
}

export function createReferenceRow(courseCode) {
    const courseData = courses[courseCode];

    if (!courseData) return null;

    const row = document.createElement('div');
    row.className = 'reference-course-row';

    let referenceCodeHTML;
    let separator = null;

    if (courseCode.includes(' or ')) {
        separator = ' or ';
    } else if (courseCode.includes(' & ')) {
        separator = ' & ';
    }

    if (separator) {
        const codes = courseCode.split(separator).map(c => c.trim());

        const linkedCodes = codes.map(code => {
            const link = courseLinks[code] || '#';
            if (link !== '#') {
                return `<a href="${link}" class="course-code" target="_blank" rel="noopener noreferrer">${code}</a>`;
            } else return code;
        }).join(separator);

        referenceCodeHTML = `<div class="course-code-container">${linkedCodes}</div>`;
    } else {
        const link = courseLinks[courseCode] || '#';
        referenceCodeHTML = link !== '#'
            ? `<a href="${link}" class="reference-course-code" target="_blank" rel="noopener noreferrer">${courseCode}</a>`
            : `<div class="reference-course-code">${courseCode}</div>`;
    }

    row.innerHTML = `
        ${referenceCodeHTML}
        <div class="reference-course-name">${courseData.name}</div>
        <div class="reference-course-credits">${courseData.credits} ${courseData.credits === 1 ? 'credit' : 'credits'}</div>    
        <label class="reference-checkbox-label">
            <input type="checkbox" class="reference-row-checkbox">
        </label>
    `;

    // grab the checkbox after innerHTML is set
    const checkbox = row.querySelector('.reference-row-checkbox');
    checkbox.addEventListener('change', () => {
        row.style.backgroundColor = checkbox.checked ? '#d4edda' : '';
    });

    return row;
}

// add courses to a section
function populateCourseSection(elementId, courseCodes) {
    const container = document.getElementById(elementId);

    if (!container) {
        console.error(`Container not found: ${elementId}`);
        return;
    }

    courseCodes.forEach(code => {
        const row = createCourseRow(code);
        if (row) {
            container.appendChild(row);
        }
    });
}

// group courses by subject using course codes
function separateCoursesBySubject(courseCodes) {
    const separated = {
        biology: [],
        chemistry: [],
        physics: [],
        math: [],
        anatomy: [],
        psychology: [],
        other: []
    };

    courseCodes.forEach(code => {
        if (code.startsWith('BIOL')) separated.biology.push(code);
        else if (code.startsWith('CHEM')) separated.chemistry.push(code);
        else if (code.startsWith('PHYS')) separated.physics.push(code);
        else if (code.startsWith('MATH')) separated.math.push(code);
        else if (code.startsWith('HPHY')) separated.anatomy.push(code);
        else if (code.startsWith('PSYC')) separated.psychology.push(code);
        else separated.other.push(code);
    });

    return separated;
}

// helper to populate multiple sections with a mapping
function populateMultipleSections(mapping) {
    Object.entries(mapping).forEach(([elementId, courseCodes]) => {
        populateCourseSection(elementId, courseCodes);
    });
}

// display recommended courses based on career path
function displayRecommendedCourses(courseCodes, pathKey) {
    const displayContainer = document.getElementById('recommended-courses-display');
    if (!displayContainer) return;

    const pathTitles = {
        medicine: 'Medicine',
        physician_assistant: 'Physician Assistant',
        dental: 'Dental',
        physical_therapy: 'Physical Therapy',
        occupational_therapy: 'Occupational Therapy',
        pharmacy: 'Pharmacy',
        optometry: 'Optometry',
        nursing: 'Nursing'
    };

    const subjectLabels = {
        biology: 'Biology',
        chemistry: 'Chemistry',
        physics: 'Physics',
        math: 'Mathematics',
        anatomy: 'Anatomy & Physiology',
        psychology: 'Psychology',
        other: 'Other'
    };

    // clear previous content
    displayContainer.innerHTML = '';

    // add main header
    const mainHeader = document.createElement('h3');
    mainHeader.textContent = `Pre-${pathTitles[pathKey]} Recommended Coursework`;
    mainHeader.className = 'recommended-header';
    displayContainer.appendChild(mainHeader);

    const separated = separateCoursesBySubject(courseCodes);

    // create subsections for each subject
    Object.entries(separated).forEach(([subject, codes]) => {
        if (codes.length > 0) {
            const subsection = document.createElement('div');
            subsection.className = 'subsection';

            const heading = document.createElement('h4');
            heading.textContent = subjectLabels[subject];
            heading.className = '';

            subsection.appendChild(heading);

            const content = document.createElement('div');
            content.className = 'subsection-content';

            codes.forEach(code => {
                const row = createCourseRow(code);
                if (row) content.appendChild(row);
            });

            attachSubsectionToggle(heading, content);

            subsection.appendChild(content);
            displayContainer.appendChild(subsection);
        }
    });
}

function displayRecommendedSchedule(careerPath) {
    const displayContainer = document.getElementById('recommended-schedules-display');
    if (!displayContainer) return;

    // let user clear schedule
    const scheduleSelect = document.getElementById('recommended-schedules-career-path');
    if (!scheduleSelect) {
        displayContainer.innerHTML = '';
    }

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

    // container for content shown after selection
    const courseworkContainer = document.createElement('div');
    courseworkContainer.id = 'coursework-container';
    displayContainer.appendChild(courseworkContainer);

    displayContainer.innerHTML = `<h4 class="recommended-header">Pre-${careerPath} Sample Plan</h4>`;

    // add each semester and its courses
    semesters.forEach(({ title, courses }) => {
        // semester heading
        const semesterHeader = document.createElement('h4');
        semesterHeader.textContent = title;
        semesterHeader.className = 'subsection';
        displayContainer.appendChild(semesterHeader);

        // add courses
        const content = document.createElement('div');
        courses.forEach(course => {
            const row = createCourseRow(course);
            if (row) content.appendChild(row);
        });

        displayContainer.appendChild(content);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // HPHY requirements
    populateMultipleSections({
        'core-stem': humanPhys.coreSTEM,
        'lower-division': humanPhys.lowerDivision,
        'upper-division': humanPhys.upperDivision,
    });

    // GU core classes
    populateMultipleSections({
        'core-year1': core.year1,
        'core-year2': core.year2,
        'core-year3': core.year3,
        'core-year4': core.year4
    });

    // recommended schedules
    populateMultipleSections({
        // undecided 4 year plan
        'undecided-freshman-fall-schedule': progression.freshman.fall,
        'undecided-freshman-spring-schedule': progression.freshman.spring,
        'undecided-sophomore-fall-schedule': progression.sophomore.fall,
        'undecided-sophomore-spring-schedule': progression.sophomore.spring,
        'undecided-junior-fall-schedule': progression.junior.fall,
        'undecided-junior-spring-schedule': progression.junior.spring,
        'undecided-senior-fall-schedule': progression.senior.fall,
        'undecided-senior-spring-schedule': progression.senior.spring,
    });
    populateMultipleSections({
        // recommended coursework for now (redundancies removed)
        'pre-med-schedule': recommended.medicine,
        'pre-physician-schedule': recommended.physician_assistant,
        'pre-dental-schedule': recommended.dental,
        'pre-physical-therapy-schedule': recommended.physical_therapy,
        'pre-occupational-therapy-schedule': recommended.occupational_therapy,
        'pre-pharmacy-schedule': recommended.pharmacy,
        'pre-optometry-schedule': recommended.optometry,
    });

    // sample progression classes
    // populateMultipleSections({
    //     'freshman-fall': progression.freshman.fall,
    //     'freshman-spring': progression.freshman.spring,
    //     'sophomore-fall': progression.sophomore.fall,
    //     'sophomore-spring': progression.sophomore.spring,
    //     'junior-fall': progression.junior.fall,
    //     'junior-spring': progression.junior.spring,
    //     'senior-fall': progression.senior.fall,
    //     'senior-spring': progression.senior.spring
    // });

    // listener for download as pdf buttons
    document.querySelectorAll('.btn-download').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const sectionId = button.dataset.section;
            generateSectionPDF(sectionId);
        });
    });

    // recommended schedule selector
    const scheduleSelect = document.getElementById('recommended-schedules-career-path');
    if (scheduleSelect) {
        scheduleSelect.addEventListener('change', function(e) {
            const scheduleChoice = e.target.value;
            if (scheduleChoice === 'clear') {
                const scheduleContainer = document.getElementById('recommended-schedules-display');
                scheduleContainer.innerHTML = '';
                return;
            }
            displayRecommendedSchedule(scheduleChoice);
        });
    }

    // career path selector
    const careerPathSelect = document.getElementById('career-path');
    if (careerPathSelect) {
        careerPathSelect.addEventListener('change', function(e) {
            const selectedPath = e.target.value;
            if (selectedPath === 'clear') {
                const coursesContainer = document.getElementById('recommended-courses-display');
                coursesContainer.innerHTML = '';
                return;
            }
            displayRecommendedCourses(recommended[selectedPath], selectedPath);
        });
    }

    // download all sheets
    const allSheetsBtn = document.querySelector('.btn.btn-secondary');
    if (allSheetsBtn) {
        allSheetsBtn.addEventListener('click', (e) => {
            generateSectionPDF('required-courses');
            generateSectionPDF('gu-core-courses');
            generateSectionPDF('sample-plan');
            generateSectionPDF('recommended');
        });
    }
    initializeSubsectionToggles();
});