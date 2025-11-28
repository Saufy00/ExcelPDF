import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { type ExcelSheet } from './excel';

export const generatePDF = (sheets: ExcelSheet[], fileName: string = 'export.pdf') => {
    // Initialize with first sheet's orientation (will be reset per page)
    const doc = new jsPDF({ orientation: 'landscape' });

    if (sheets.length === 0) return;

    // Sanitize filename: remove invalid characters for Windows/Unix
    fileName = fileName.replace(/[^a-z0-9 \.\-_]/gi, '_');

    // Ensure filename ends with .pdf
    if (!fileName.toLowerCase().endsWith('.pdf')) {
        fileName += '.pdf';
    }

    console.log("Saving PDF as:", fileName);

    sheets.forEach((sheet, index) => {
        // Create a temporary container for the HTML
        const container = document.createElement('div');
        container.innerHTML = sheet.html;
        const table = container.querySelector('table');

        if (!table) return;

        // Add new page for subsequent sheets
        if (index > 0) {
            doc.addPage();
        }

        // Append to body to ensure styles/dimensions are computed
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        document.body.appendChild(container);

        doc.setPage(index + 1);

        autoTable(doc, {
            html: table,
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
            horizontalPageBreakRepeat: 0,
            margin: { top: 20, right: 10, bottom: 10, left: 10 },
            theme: 'grid',
            didDrawPage: (data) => {
                // Header
                doc.setFontSize(16);
                doc.text(`Sheet: ${sheet.name}`, 14, 15);

                // Footer page number
                const pageSize = doc.internal.pageSize;
                const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                doc.setFontSize(10);
                doc.text(`Page ${data.pageNumber}`, 14, pageHeight - 10);
            }
        });

        // Cleanup
        document.body.removeChild(container);
    });

    doc.save(fileName);
};
