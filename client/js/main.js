import courses from '/data/courses.js';
import { humanPhys, core } from '/data/required.js';
import progression from '/data/progression.js';
import recommended from '/data/recommended.js';
import courseLinks from '/data/course-links.js';
import { generateSectionPDF } from "./pdf-generator.js";

// show/hide sections
function toggleSection(sectionId) {
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

    // check if courseCode contains " or " (multiple courses)
    if (courseCode.includes(' or ')) {
        const codes = courseCode.split(' or ').map(c => c.trim());

        // create links for each code
        const linkedCodes = codes.map(code => {
            const link = courseLinks[code] || '#';
            if (link !== '#') {
                return `<a href="${link}" class="course-code" target="_blank" rel="noopener noreferrer">${code}</a>`;
            } else {
                return code;
            }
        }).join(' or ');

        courseCodeHTML = `<div class="course-code-container">${linkedCodes}</div>`;
    } else {
        // single course code - existing logic
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
            heading.className = 'collapsed';

            subsection.appendChild(heading);

            const content = document.createElement('div');
            content.className = 'subsection-content collapsed';

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

document.addEventListener('DOMContentLoaded', function() {
    // render Human Phys required courses
    populateMultipleSections({
        'core-stem-courses': humanPhys.coreSTEM,
        'lower-division-courses': humanPhys.lowerDivision,
        'upper-division-courses': humanPhys.upperDivision
    });

    // render GU Core required courses
    populateMultipleSections({
        'core-year1': core.year1,
        'core-year2': core.year2,
        'core-year3': core.year3,
        'core-year4': core.year4
    });

    // render sample progression courses
    populateMultipleSections({
        'freshman-fall': progression.freshman.fall,
        'freshman-spring': progression.freshman.spring,
        'sophomore-fall': progression.sophomore.fall,
        'sophomore-spring': progression.sophomore.spring,
        'junior-fall': progression.junior.fall,
        'junior-spring': progression.junior.spring,
        'senior-fall': progression.senior.fall,
        'senior-spring': progression.senior.spring
    });

    // listener for download as pdf buttons
    document.querySelectorAll('.btn-download').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const sectionId = button.dataset.section;
            generateSectionPDF(sectionId);
        });
    });

    // career path selector
    const careerPathSelect = document.getElementById('career-path');
    if (careerPathSelect) {
        careerPathSelect.addEventListener('change', function(e) {
            const selectedPath = e.target.value;
            if (selectedPath && recommended[selectedPath]) {
                displayRecommendedCourses(recommended[selectedPath], selectedPath);
            }
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