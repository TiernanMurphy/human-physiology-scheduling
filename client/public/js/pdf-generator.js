const { jsPDF } = window.jspdf;

// downloads pdf based on which section's button was clicked
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

// styles human phys required coursework pdf
function generateRequiredCoursesPDF() {
    const doc = new jsPDF();

    // title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Human Physiology Required Courses', 105, 20, { align: 'center' });

    let yPosition = 35;

    // subsections and titles
    const subsections = ['core-stem-courses', 'lower-division-courses', 'upper-division-courses'];
    const subsectionTitles = ['Core STEM', 'Lower Division', 'Upper Division'];

    subsections.forEach((subsectionId, index) => {
        const container = document.getElementById(subsectionId);
        if (!container) return;

        // Subsection title
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(subsectionTitles[index], 20, yPosition);
        yPosition += 8;

        // Draw a line under subsection title
        doc.setDrawColor(52, 152, 219); // blue color
        doc.setLineWidth(0.5);
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 5;

        // column headers
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text('Course Code', 25, yPosition);
        doc.text('Course Name', 90, yPosition);
        doc.text('Credits', 170, yPosition);
        yPosition += 5;

        // course rows
        doc.setFont(undefined, 'normal');

        const courseRows = container.querySelectorAll('.course-row');
        let rowIndex = 0;

        courseRows.forEach(row => {
            const code = row.querySelector('.course-code').textContent.trim();
            const name = row.querySelector('.course-name').textContent.trim();
            const creditsText = row.querySelector('.course-credits').textContent.trim();

            // just get the number from credits
            const credits = creditsText.split(' ')[0];

            // wrap course code if needed
            const wrappedCode = doc.splitTextToSize(code, 40);

            // wrap course name if needed
            const wrappedName = doc.splitTextToSize(name, 95);

            // calculate row height based on wrapped text
            const maxLines = Math.max(wrappedCode.length, wrappedName.length);
            const rowHeight = maxLines * 5;

            // alternating row background
            if (rowIndex % 2 === 0) {
                doc.setFillColor(250, 250, 250);  // light grey
            } else {
                doc.setFillColor(255, 255, 255);  // white
            }
            // fill rectangle for row background
            doc.rect(20, yPosition - 4, 170, 7, 'F');

            // text content
            doc.text(wrappedCode, 25, yPosition);
            doc.text(wrappedName, 70, yPosition);
            doc.text(credits, 170, yPosition);

            yPosition += rowHeight + 2;

            rowIndex++;
        });

        yPosition += 8; // Space between subsections
    });

    doc.save('required-human-physiology-courses.pdf');
}

// styles GU Core requirements pdf
function generateGUCorePDF() {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('GU Core Requirements', 105, 20, { align: 'center' });

    let yPosition = 35;

    // Get subsections
    const subsections = ['core-year1', 'core-year2', 'core-year3', 'core-year4'];
    const subsectionTitles = ['Year 1', 'Year 2', 'Year 3', 'Year 4'];

    subsections.forEach((subsectionId, index) => {
        const container = document.getElementById(subsectionId);
        if (!container) return;

        // Subsection title
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(subsectionTitles[index], 20, yPosition);
        yPosition += 8;

        // Draw a line under subsection title
        doc.setDrawColor(52, 152, 219); // blue color
        doc.setLineWidth(0.5);
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 5;

        // Column headers
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text('Course Code', 25, yPosition);
        doc.text('Course Name', 90, yPosition);
        doc.text('Credits', 170, yPosition);
        yPosition += 5;

        // Course rows
        doc.setFont(undefined, 'normal');

        const courseRows = container.querySelectorAll('.course-row');
        let rowIndex = 0;

        courseRows.forEach(row => {
            const code = row.querySelector('.course-code').textContent.trim();
            const name = row.querySelector('.course-name').textContent.trim();
            const creditsText = row.querySelector('.course-credits').textContent.trim();

            // Extract just the number from credits
            const credits = creditsText.split(' ')[0];

            // Wrap course code if needed
            const wrappedCode = doc.splitTextToSize(code, 40);

            // Wrap course name if needed
            const wrappedName = doc.splitTextToSize(name, 75);

            // Calculate row height based on max lines needed
            const maxLines = Math.max(wrappedCode.length, wrappedName.length);
            const rowHeight = maxLines * 5;

            // Alternating row background
            if (rowIndex % 2 === 0) {
                doc.setFillColor(250, 250, 250); // light gray
            } else {
                doc.setFillColor(255, 255, 255); // white
            }
            doc.rect(20, yPosition - 4, 170, rowHeight + 2, 'F');

            // Text content
            doc.text(wrappedCode, 25, yPosition);
            doc.text(wrappedName, 90, yPosition);
            doc.text(credits, 170, yPosition);

            yPosition += rowHeight + 2;

            rowIndex++;
        });

        yPosition += 8; // Space between subsections
    });

    doc.save('gu-core-requirements.pdf');
}

function generateSamplePlanPDF() {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Sample 4-Year Progression', 105, 20, { align: 'center' });

    let yPosition = 35;

    // Define the years and semesters
    const years = [
        { name: 'Freshman Year', fall: 'freshman-fall', spring: 'freshman-spring' },
        { name: 'Sophomore Year', fall: 'sophomore-fall', spring: 'sophomore-spring' },
        { name: 'Junior Year', fall: 'junior-fall', spring: 'junior-spring' },
        { name: 'Senior Year', fall: 'senior-fall', spring: 'senior-spring' }
    ];

    years.forEach((year) => {
        // Year title
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(year.name, 20, yPosition);
        yPosition += 8;

        // Draw a line under year title
        doc.setDrawColor(52, 152, 219);
        doc.setLineWidth(0.5);
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 5;

        // Semester titles on same line
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Fall', 25, yPosition);
        doc.text('Spring', 110, yPosition);
        yPosition += 6;

        // Get both semester containers
        const fallContainer = document.getElementById(year.fall);
        const springContainer = document.getElementById(year.spring);

        // Render Fall semester (left column)
        let fallYPosition = yPosition;
        const fallXOffset = 20;

        if (fallContainer) {
            // Column headers
            doc.setFontSize(8);
            doc.setFont(undefined, 'bold');
            doc.text('Code', fallXOffset + 2, fallYPosition);
            doc.text('Name', fallXOffset + 20, fallYPosition);
            doc.text('Cr', fallXOffset + 75, fallYPosition);
            fallYPosition += 4;

            // Course rows
            doc.setFont(undefined, 'normal');
            const courseRows = fallContainer.querySelectorAll('.course-row');
            let rowIndex = 0;

            courseRows.forEach(row => {
                const code = row.querySelector('.course-code').textContent.trim();
                const name = row.querySelector('.course-name').textContent.trim();
                const creditsText = row.querySelector('.course-credits').textContent.trim();
                const credits = creditsText.split(' ')[0];

                const wrappedCode = doc.splitTextToSize(code, 15);
                const wrappedName = doc.splitTextToSize(name, 50);

                const maxLines = Math.max(wrappedCode.length, wrappedName.length);
                const rowHeight = maxLines * 4;

                // Alternating row background
                if (rowIndex % 2 === 0) {
                    doc.setFillColor(250, 250, 250);
                } else {
                    doc.setFillColor(255, 255, 255);
                }
                doc.rect(fallXOffset, fallYPosition - 3, 80, rowHeight + 1, 'F');

                // Text content
                doc.text(wrappedCode, fallXOffset + 2, fallYPosition);
                doc.text(wrappedName, fallXOffset + 20, fallYPosition);
                doc.text(credits, fallXOffset + 75, fallYPosition);

                fallYPosition += rowHeight + 1;
                rowIndex++;
            });
        }

        // Render Spring semester (right column)
        let springYPosition = yPosition;
        const springXOffset = 105;

        if (springContainer) {
            // Column headers
            doc.setFontSize(8);
            doc.setFont(undefined, 'bold');
            doc.text('Code', springXOffset + 2, springYPosition);
            doc.text('Name', springXOffset + 20, springYPosition);
            doc.text('Cr', springXOffset + 75, springYPosition);
            springYPosition += 4;

            // Course rows
            doc.setFont(undefined, 'normal');
            const courseRows = springContainer.querySelectorAll('.course-row');
            let rowIndex = 0;

            courseRows.forEach(row => {
                const code = row.querySelector('.course-code').textContent.trim();
                const name = row.querySelector('.course-name').textContent.trim();
                const creditsText = row.querySelector('.course-credits').textContent.trim();
                const credits = creditsText.split(' ')[0];

                const wrappedCode = doc.splitTextToSize(code, 15);
                const wrappedName = doc.splitTextToSize(name, 50);

                const maxLines = Math.max(wrappedCode.length, wrappedName.length);
                const rowHeight = maxLines * 4;

                // Alternating row background
                if (rowIndex % 2 === 0) {
                    doc.setFillColor(250, 250, 250);
                } else {
                    doc.setFillColor(255, 255, 255);
                }
                doc.rect(springXOffset, springYPosition - 3, 80, rowHeight + 1, 'F');

                // Text content
                doc.text(wrappedCode, springXOffset + 2, springYPosition);
                doc.text(wrappedName, springXOffset + 20, springYPosition);
                doc.text(credits, springXOffset + 75, springYPosition);

                springYPosition += rowHeight + 1;
                rowIndex++;
            });
        }

        // Move yPosition to the bottom of the tallest column
        yPosition = Math.max(fallYPosition, springYPosition) + 5;
    });

    doc.save('sample-4-year-progression.pdf');
}

function generateRecommendedPDF() {
    const doc = new jsPDF();

    // Get the selected career path
    const careerPathSelect = document.getElementById('career-path');
    const selectedPath = careerPathSelect.value;

    if (!selectedPath) {
        alert('Please select a career path first!');
        return;
    }

    // Get the path title from the dropdown
    const selectedOption = careerPathSelect.options[careerPathSelect.selectedIndex].text;

    // Title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text(`Pre-${selectedOption} Recommended Coursework`, 105, 20, { align: 'center' });

    let yPosition = 35;

    // Get the display container
    const displayContainer = document.getElementById('recommended-courses-display');

    if (!displayContainer || displayContainer.children.length === 0) {
        alert('No coursework displayed. Please select a career path first!');
        return;
    }

    // Get all subsections (Biology, Chemistry, etc.)
    const subsections = displayContainer.querySelectorAll('.subsection');

    subsections.forEach((subsection) => {
        const heading = subsection.querySelector('h4');
        if (!heading) return;

        // Subsection title
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(heading.textContent, 20, yPosition);
        yPosition += 8;

        // Draw a line under subsection title
        doc.setDrawColor(52, 152, 219);
        doc.setLineWidth(0.5);
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 5;

        // Column headers
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text('Course Code', 25, yPosition);
        doc.text('Course Name', 90, yPosition);
        doc.text('Credits', 170, yPosition);
        yPosition += 5;

        // Course rows
        doc.setFont(undefined, 'normal');

        const courseList = subsection.querySelector('.course-list');
        if (!courseList) return;

        const courseRows = courseList.querySelectorAll('.course-row');
        let rowIndex = 0;

        courseRows.forEach(row => {
            const code = row.querySelector('.course-code').textContent.trim();
            const name = row.querySelector('.course-name').textContent.trim();
            const creditsText = row.querySelector('.course-credits').textContent.trim();

            // Extract just the number from credits
            const credits = creditsText.split(' ')[0];

            // Wrap course code if needed
            const wrappedCode = doc.splitTextToSize(code, 40);

            // Wrap course name if needed
            const wrappedName = doc.splitTextToSize(name, 75);

            // Calculate row height based on max lines needed
            const maxLines = Math.max(wrappedCode.length, wrappedName.length);
            const rowHeight = maxLines * 5;

            // Alternating row background
            if (rowIndex % 2 === 0) {
                doc.setFillColor(250, 250, 250);
            } else {
                doc.setFillColor(255, 255, 255);
            }
            doc.rect(20, yPosition - 4, 170, rowHeight + 2, 'F');

            // Text content
            doc.text(wrappedCode, 25, yPosition);
            doc.text(wrappedName, 90, yPosition);
            doc.text(credits, 170, yPosition);

            yPosition += rowHeight + 2;

            rowIndex++;
        });

        yPosition += 8; // Space between subsections
    });

    // Create filename based on selected path
    const filename = `pre-${selectedPath}-recommended-coursework.pdf`;
    doc.save(filename);
}

// Keep the old generic function as fallback
function generateGenericPDF(sectionId) {
    const doc = new jsPDF();
    const section = document.getElementById(sectionId);
    if (!section) return;

    const sectionHeader = section.previousElementSibling;
    const title = sectionHeader.querySelector('h3').textContent;

    doc.setFontSize(18);
    doc.text(title, 20, 20);

    let yPosition = 35;
    const courseRows = section.querySelectorAll('.course-row');

    doc.setFontSize(12);
    courseRows.forEach(row => {
        const code = row.querySelector('.course-code').textContent;
        const name = row.querySelector('.course-name').textContent;
        const credits = row.querySelector('.course-credits').textContent;

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