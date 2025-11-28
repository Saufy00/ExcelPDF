import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePDF = (data: any[], fileName: string = 'export.pdf') => {
    const doc = new jsPDF({ orientation: 'landscape' });

    if (data.length === 0) return;

    // Sanitize filename: remove invalid characters for Windows/Unix
    fileName = fileName.replace(/[^a-z0-9 \.\-_]/gi, '_');

    // Ensure filename ends with .pdf
    if (!fileName.toLowerCase().endsWith('.pdf')) {
        fileName += '.pdf';
    }

    console.log("Saving PDF as:", fileName);

    const headers = Object.keys(data[0]);
    // Ensure all data are strings to prevent rendering issues
    const rows = data.map(row => Object.values(row).map(val => String(val)));

    autoTable(doc, {
        head: [headers],
        body: rows,
        styles: {
            overflow: 'linebreak',
            cellWidth: 'wrap',
            fontSize: 8,
            valign: 'middle',
        },
        headStyles: {
            fillColor: [66, 135, 245],
            textColor: 255,
            fontStyle: 'bold',
        },
        // Split columns across pages if they don't fit
        horizontalPageBreak: true,
        horizontalPageBreakRepeat: 0, // Repeat header on new pages
        margin: { top: 20, right: 10, bottom: 10, left: 10 },
        theme: 'grid',
        didDrawPage: () => {
            // Header
            doc.setFontSize(16);
            doc.text('Exported Data', 14, 15);
        }
    });

    doc.save(fileName);
};
