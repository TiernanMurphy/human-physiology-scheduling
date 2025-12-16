// Get jsPDF from the global window object (loaded via CDN)
const { jsPDF } = window.jspdf;

export function generateSectionPDF(sectionId) {
    const doc = new jsPDF();

    // Get the section element
    const section = document.getElementById(sectionId);
    if (!section) {
        console.error(`Section not found: ${sectionId}`);
        return;
    }

    // Get the section title from the header
    const sectionHeader = section.previousElementSibling;
    const title = sectionHeader.querySelector('h3').textContent;

    // Add title to PDF
    doc.setFontSize(18);
    doc.text(title, 20, 20);

    let yPosition = 35;

    // Get all course rows from this section
    const courseRows = section.querySelectorAll('.course-row');

    doc.setFontSize(12);
    courseRows.forEach(row => {
        const code = row.querySelector('.course-code').textContent;
        const name = row.querySelector('.course-name').textContent;
        const credits = row.querySelector('.course-credits').textContent;

        // Check if we need a new page
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }

        doc.text(`${code}: ${name} (${credits})`, 20, yPosition);
        yPosition += 10;
    });

    // Download the PDF
    doc.save(`${sectionId}.pdf`);
}

export function generateAllSectionsPDF() {
    const doc = new jsPDF();

    // We'll implement this later to combine all sections
    console.log('Generate all sections - coming soon');
}