const { jsPDF } = window.jspdf;

// PDF styling constants
const COLORS = {
    BLUE: [52, 152, 219],
    LIGHT_GRAY: [250, 250, 250],
    WHITE: [255, 255, 255]
};

const FONTS = {
    TITLE: { size: 20, style: 'bold' },
    SUBSECTION: { size: 14, style: 'bold' },
    COLUMN_HEADER: { size: 10, style: 'bold' },
    NORMAL: { size: 10, style: 'normal' },
    SMALL: { size: 8, style: 'bold' }
};

// main entry point
export function generateSectionPDF(sectionId) {
    switch(sectionId) {
        case 'required-courses':
            generateRequiredCoursesPDF();
            break;
        case 'gu-core-courses':
            generateGUCorePDF();
            break;
        case 'sample-plan':
            generateSamplePlanPDF();
            break;
        case 'recommended':
            generateRecommendedPDF();
            break;
        default:
            generateGenericPDF(sectionId);
    }
}

function addTitle(doc, text, yPosition = 20) {
    doc.setFontSize(FONTS.TITLE.size);
    doc.setFont(undefined, FONTS.TITLE.style);
    doc.text(text, 105, yPosition, { align: 'center' });
    return yPosition + 15;
}

function addSubsectionHeader(doc, text, yPosition) {
    doc.setFontSize(FONTS.SUBSECTION.size);
    doc.setFont(undefined, FONTS.SUBSECTION.style);
    doc.text(text, 20, yPosition);
    yPosition += 8;

    doc.setDrawColor(...COLORS.BLUE);
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, 190, yPosition);

    return yPosition + 5;
}

// helper: add column headers
function addColumnHeaders(doc, headers, yPosition) {
    doc.setFontSize(headers.fontSize || FONTS.COLUMN_HEADER.size);
    doc.setFont(undefined, FONTS.COLUMN_HEADER.style);

    headers.columns.forEach(col => {
        doc.text(col.text, col.x, yPosition);
    });

    return yPosition + 5;
}

// helper: extract course data from a row element
function getCourseData(row) {
    const code = row.querySelector('.course-code')?.textContent.trim() || '';
    const name = row.querySelector('.course-name')?.textContent.trim() || '';
    const creditsText = row.querySelector('.course-credits')?.textContent.trim() || '';
    const credits = creditsText.split(' ')[0];

    return { code, name, credits };
}

// helper: render a single course row with alternating background
function renderCourseRow(doc, courseData, config, yPosition, rowIndex) {
    const { code, name, credits } = courseData;
    const { xOffset = 20, codeX = 25, nameX = 90, creditsX = 170,
        codeWidth = 40, nameWidth = 75, rowWidth = 170 } = config;

    // Wrap text
    const wrappedCode = doc.splitTextToSize(code, codeWidth);
    const wrappedName = doc.splitTextToSize(name, nameWidth);
    const maxLines = Math.max(wrappedCode.length, wrappedName.length);
    const rowHeight = maxLines * 5;

    // Alternating background
    const fillColor = rowIndex % 2 === 0 ? COLORS.LIGHT_GRAY : COLORS.WHITE;
    doc.setFillColor(...fillColor);
    doc.rect(xOffset, yPosition - 4, rowWidth, rowHeight + 2, 'F');

    // Text content
    doc.setFont(undefined, FONTS.NORMAL.style);
    doc.text(wrappedCode, codeX, yPosition);
    doc.text(wrappedName, nameX, yPosition);
    doc.text(credits, creditsX, yPosition);

    return yPosition + rowHeight + 2;
}

// helper: render all courses in a container
function renderCourseList(doc, container, config, yPosition) {
    if (!container) return yPosition;

    const courseRows = container.querySelectorAll('.course-row');
    let rowIndex = 0;

    courseRows.forEach(row => {
        const courseData = getCourseData(row);
        yPosition = renderCourseRow(doc, courseData, config, yPosition, rowIndex);
        rowIndex++;
    });

    return yPosition + 8; // Space after section
}

// helper: render subsection with courses
function renderSubsection(doc, subsectionId, title, config, yPosition) {
    const container = document.getElementById(subsectionId);
    if (!container) return yPosition;

    // Subsection header
    yPosition = addSubsectionHeader(doc, title, yPosition);

    // Column headers
    const headers = {
        columns: [
            { text: 'Course Code', x: config.codeX || 25 },
            { text: 'Course Name', x: config.nameX || 90 },
            { text: 'Credits', x: config.creditsX || 170 }
        ]
    };
    yPosition = addColumnHeaders(doc, headers, yPosition);

    // Course list
    return renderCourseList(doc, container, config, yPosition);
}

// required courses PDF
function generateRequiredCoursesPDF() {
    const doc = new jsPDF();
    let yPosition = addTitle(doc, 'Human Physiology Required Courses');

    const subsections = [
        { id: 'core-stem-courses', title: 'Core STEM' },
        { id: 'lower-division-courses', title: 'Lower Division' },
        { id: 'upper-division-courses', title: 'Upper Division' }
    ];

    const config = {
        xOffset: 20,
        codeX: 25,
        nameX: 70,
        creditsX: 170,
        codeWidth: 40,
        nameWidth: 95,
        rowWidth: 170
    };

    subsections.forEach(section => {
        yPosition = renderSubsection(doc, section.id, section.title, config, yPosition);
    });

    doc.save('required-human-physiology-courses.pdf');
}

// GU Core PDF
function generateGUCorePDF() {
    const doc = new jsPDF();
    let yPosition = addTitle(doc, 'GU Core Requirements');

    const subsections = [
        { id: 'core-year1', title: 'Year 1' },
        { id: 'core-year2', title: 'Year 2' },
        { id: 'core-year3', title: 'Year 3' },
        { id: 'core-year4', title: 'Year 4' }
    ];

    const config = {
        xOffset: 20,
        codeX: 25,
        nameX: 90,
        creditsX: 170,
        codeWidth: 40,
        nameWidth: 75,
        rowWidth: 170
    };

    subsections.forEach(section => {
        yPosition = renderSubsection(doc, section.id, section.title, config, yPosition);
    });

    doc.save('gu-core-requirements.pdf');
}

// sample plan PDF (side-by-side layout)
function generateSamplePlanPDF() {
    const doc = new jsPDF();
    let yPosition = addTitle(doc, 'Sample 4-Year Progression');

    const years = [
        { name: 'Freshman Year', fall: 'freshman-fall', spring: 'freshman-spring' },
        { name: 'Sophomore Year', fall: 'sophomore-fall', spring: 'sophomore-spring' },
        { name: 'Junior Year', fall: 'junior-fall', spring: 'junior-spring' },
        { name: 'Senior Year', fall: 'senior-fall', spring: 'senior-spring' }
    ];

    years.forEach(year => {
        yPosition = addSubsectionHeader(doc, year.name, yPosition);

        // Semester titles
        doc.setFontSize(FONTS.SUBSECTION.size - 2);
        doc.setFont(undefined, FONTS.SUBSECTION.style);
        doc.text('Fall', 25, yPosition);
        doc.text('Spring', 110, yPosition);
        yPosition += 6;

        // Config for left column (Fall)
        const fallConfig = {
            xOffset: 20,
            codeX: 22,
            nameX: 40,
            creditsX: 95,
            codeWidth: 15,
            nameWidth: 50,
            rowWidth: 80
        };

        // Config for right column (Spring)
        const springConfig = {
            xOffset: 105,
            codeX: 107,
            nameX: 125,
            creditsX: 180,
            codeWidth: 15,
            nameWidth: 50,
            rowWidth: 80
        };

        const startY = yPosition;

        // Render Fall semester
        const fallContainer = document.getElementById(year.fall);
        const fallHeaders = {
            fontSize: FONTS.SMALL.size,
            columns: [
                { text: 'Code', x: fallConfig.codeX },
                { text: 'Name', x: fallConfig.nameX },
                { text: 'Cr', x: fallConfig.creditsX }
            ]
        };
        let fallY = addColumnHeaders(doc, fallHeaders, yPosition);
        fallY = renderCourseListCompact(doc, fallContainer, fallConfig, fallY);

        // Render Spring semester
        const springContainer = document.getElementById(year.spring);
        const springHeaders = {
            fontSize: FONTS.SMALL.size,
            columns: [
                { text: 'Code', x: springConfig.codeX },
                { text: 'Name', x: springConfig.nameX },
                { text: 'Cr', x: springConfig.creditsX }
            ]
        };
        let springY = addColumnHeaders(doc, springHeaders, yPosition);
        springY = renderCourseListCompact(doc, springContainer, springConfig, springY);

        yPosition = Math.max(fallY, springY) + 5;
    });

    doc.save('sample-4-year-progression.pdf');
}

// helper for compact course rendering (used in sample plan)
function renderCourseListCompact(doc, container, config, yPosition) {
    if (!container) return yPosition;

    const courseRows = container.querySelectorAll('.course-row');
    let rowIndex = 0;

    courseRows.forEach(row => {
        const courseData = getCourseData(row);
        yPosition = renderCourseRowCompact(doc, courseData, config, yPosition, rowIndex);
        rowIndex++;
    });

    return yPosition;
}

function renderCourseRowCompact(doc, courseData, config, yPosition, rowIndex) {
    const { code, name, credits } = courseData;
    const { xOffset, codeX, nameX, creditsX, codeWidth, nameWidth, rowWidth } = config;

    const wrappedCode = doc.splitTextToSize(code, codeWidth);
    const wrappedName = doc.splitTextToSize(name, nameWidth);
    const maxLines = Math.max(wrappedCode.length, wrappedName.length);
    const rowHeight = maxLines * 4;

    const fillColor = rowIndex % 2 === 0 ? COLORS.LIGHT_GRAY : COLORS.WHITE;
    doc.setFillColor(...fillColor);
    doc.rect(xOffset, yPosition - 3, rowWidth, rowHeight + 1, 'F');

    doc.setFont(undefined, FONTS.NORMAL.style);
    doc.text(wrappedCode, codeX, yPosition);
    doc.text(wrappedName, nameX, yPosition);
    doc.text(credits, creditsX, yPosition);

    return yPosition + rowHeight + 1;
}

// recommended courses PDF
function generateRecommendedPDF() {
    const doc = new jsPDF();

    const careerPathSelect = document.getElementById('career-path');
    const selectedPath = careerPathSelect?.value;

    if (!selectedPath) {
        alert('Please select a career path first!', 'error');
        return;
    }

    const selectedOption = careerPathSelect.options[careerPathSelect.selectedIndex].text;
    let yPosition = addTitle(doc, `Pre-${selectedOption} Recommended Coursework`);

    const displayContainer = document.getElementById('recommended-courses-display');
    if (!displayContainer || displayContainer.children.length === 0) {
        alert('No coursework displayed. Please select a career path first!', 'error');
        return;
    }

    const subsections = displayContainer.querySelectorAll('.subsection');
    const config = {
        xOffset: 20,
        codeX: 25,
        nameX: 90,
        creditsX: 170,
        codeWidth: 40,
        nameWidth: 75,
        rowWidth: 170
    };

    subsections.forEach(subsection => {
        const heading = subsection.querySelector('h4');
        if (!heading) return;

        yPosition = addSubsectionHeader(doc, heading.textContent, yPosition);

        const headers = {
            columns: [
                { text: 'Course Code', x: config.codeX },
                { text: 'Course Name', x: config.nameX },
                { text: 'Credits', x: config.creditsX }
            ]
        };
        yPosition = addColumnHeaders(doc, headers, yPosition);

        const courseList = subsection.querySelector('.course-list');
        yPosition = renderCourseList(doc, courseList, config, yPosition);
    });

    const filename = `pre-${selectedPath}-recommended-coursework.pdf`;
    doc.save(filename);
}

// generate PDF for a saved plan
export function generatePlanPDF(plan) {
    const doc = new jsPDF();

    // title
    let yPosition = addTitle(doc, plan.planName || 'Course Plan');

    // plan metadata
    doc.setFontSize(FONTS.NORMAL.size);
    doc.setFont(undefined, FONTS.NORMAL.style);
    const totalCourses = plan.semesters.reduce((sum, sem) => sum + sem.courses.length, 0);
    const updatedDate = new Date(plan.updatedAt).toLocaleDateString();
    doc.text(`Total Semesters: ${plan.semesters.length}  |  Total Courses: ${totalCourses}  |  Updated: ${updatedDate}`, 105, yPosition, { align: 'center' });
    yPosition += 15;

    const config = {
        xOffset: 20,
        codeX: 25,
        nameX: 70,
        creditsX: 170,
        codeWidth: 40,
        nameWidth: 95,
        rowWidth: 170
    };

    // iterate through semesters
    plan.semesters.forEach(semester => {
        // check if we need a new page
        if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
        }

        // semester header
        yPosition = addSubsectionHeader(doc, semester.name, yPosition);

        // column headers
        const headers = {
            columns: [
                { text: 'Course Code', x: config.codeX },
                { text: 'Course Name', x: config.nameX },
                { text: 'Credits', x: config.creditsX }
            ]
        };
        yPosition = addColumnHeaders(doc, headers, yPosition);

        // courses
        if (semester.courses.length === 0) {
            doc.setFontSize(FONTS.NORMAL.size);
            doc.text('No courses', 25, yPosition);
            yPosition += 8;
        } else {
            semester.courses.forEach((course, index) => {
                const courseData = {
                  code: course.courseCode || '',
                  name: course.courseName || '',
                  credits: ''  // configure later
                };
                yPosition = renderCourseRow(doc, courseData, config, yPosition, index);

                // check if we need a new page
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
            });
        }

        yPosition += 5;
    });

    // save the PDF
    const filename = `${plan.planName.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    doc.save(filename);
}

// fallback generic PDF generator
function generateGenericPDF(sectionId) {
    const doc = new jsPDF();
    const section = document.getElementById(sectionId);
    if (!section) return;

    const sectionHeader = section.previousElementSibling;
    const title = sectionHeader?.querySelector('h3')?.textContent || 'Course List';

    let yPosition = addTitle(doc, title);

    const courseRows = section.querySelectorAll('.course-row');
    doc.setFontSize(12);

    courseRows.forEach(row => {
        const { code, name, credits } = getCourseData(row);

        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }

        doc.text(`${code}: ${name} (${credits})`, 20, yPosition);
        yPosition += 10;
    });

    doc.save(`${sectionId}.pdf`);
}

export function generateAllSectionsPDF() {
    console.log('Generate all sections - coming soon');
}