import courses from '/data/courses.js';
import { humanPhys, core } from '/data/required.js';
import progression from '/data/progression.js';
import recommended from '/data/recommended.js';
import courseLinks from '/data/course-links.js';
import { generateSectionPDF, generateAllSectionsPDF } from "./pdf-generator.js";

// toggle section visibility
function toggleSection(sectionId) {
    const content = document.getElementById(sectionId);
    const arrow = content.previousElementSibling.querySelector('.dropdown-arrow');

    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        arrow.style.transform = 'rotate(180deg)';
    } else {
        content.classList.add('hidden');
        arrow.style.transform = 'rotate(0deg)';
    }
}

// make toggleSection globally available
window.toggleSection = toggleSection;

// create a course record
function createCourseRow(courseCode) {
    const courseData = courses[courseCode];

    if (!courseData) {
        console.warn(`Course data not found for: ${courseCode}`);
        return null;
    }

    const row = document.createElement('div');
    row.className = 'course-row';

    // get the link, use '#' if not found
    const link = courseLinks[courseCode] || '#';

    // if link found, open in new tab
    const linkHTML = link !== '#'
        ? `<a href="${link}" class="course-link" target="_blank">Course Info</a>`
        : `<span class="course-link disabled">No Link</span>`;

    row.innerHTML = `
        <div class="course-code">${courseCode}</div>
        <div class="course-name">${courseData.name}</div>
        <div class="course-credits">${courseData.credits} ${courseData.credits === 1 ? 'credit' : 'credits'}</div>    
        ${linkHTML}
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

// Helper function to separate courses by subject prefix
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

// initialize page
document.addEventListener('DOMContentLoaded', function() {
    // render Human Phys required courses
    populateCourseSection('core-stem-courses', humanPhys.coreSTEM);
    populateCourseSection('lower-division-courses', humanPhys.lowerDivision);
    populateCourseSection('upper-division-courses', humanPhys.upperDivision);
    // render GU Core required courses
    populateCourseSection('core-year1', core.year1);
    populateCourseSection('core-year2', core.year2);
    populateCourseSection('core-year3', core.year3);
    populateCourseSection('core-year4', core.year4);
    // render sample progression courses
    populateCourseSection('freshman-fall', progression.freshman.fall);
    populateCourseSection('freshman-spring', progression.freshman.spring);
    populateCourseSection('sophomore-fall', progression.sophomore.fall);
    populateCourseSection('sophomore-spring', progression.sophomore.spring);
    populateCourseSection('junior-fall', progression.junior.fall);
    populateCourseSection('junior-spring', progression.junior.spring);
    populateCourseSection('senior-fall', progression.senior.fall);
    populateCourseSection('senior-spring', progression.senior.spring);
    // career path selector
    const careerPathSelect = document.getElementById('career-path');
    const displayContainer = document.getElementById('recommended-courses-display');

    if (careerPathSelect && displayContainer) {
        careerPathSelect.addEventListener('change', function(e) {
           const selectedPath = e.target.value;

           // clear previous content
            displayContainer.innerHTML = '';

            if (selectedPath && recommended[selectedPath]) {
                displayRecommendedCourses(recommended[selectedPath], selectedPath);
            }
        });
    }

    function displayRecommendedCourses(courseCodes, pathKey) {
        // create a title mapping
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

        // Add the main header
        const mainHeader = document.createElement('h3');
        mainHeader.textContent = `Pre-${pathTitles[pathKey]} Recommended Coursework`;
        mainHeader.style.marginBottom = '20px';
        mainHeader.style.color = '#2c3e50';
        mainHeader.style.fontSize = '1.5rem';
        displayContainer.appendChild(mainHeader);

        const separated = separateCoursesBySubject(courseCodes);

        // create subsections for each subject
        const subjectLabels = {
            biology: 'Biology',
            chemistry: 'Chemistry',
            physics: 'Physics',
            math: 'Mathematics',
            anatomy: 'Anatomy & Physiology',
            other: 'Other',
        };

        Object.keys(separated).forEach(subject => {
            if (separated[subject].length > 0) {
                const subsection = document.createElement('div');
                subsection.className = 'subsection';

                const heading = document.createElement('h4');
                heading.textContent = subjectLabels[subject];
                subsection.appendChild(heading);

                const courseList = document.createElement('div');
                courseList.className = 'course-list';

                separated[subject].forEach(code => {
                    const row = createCourseRow(code);
                    if (row) {
                        courseList.appendChild(row);
                    }
                });

                subsection.appendChild(courseList);
                displayContainer.appendChild(subsection);
            }
        });
    }
});

// placeholder download as pdf function
window.downloadSection = async function(sectionId) {
    console.log(`Download button clicked for section: ${sectionId}`);
    generateSectionPDF(sectionId);
};