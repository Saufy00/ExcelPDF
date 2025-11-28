import ExcelJS from 'exceljs';

export interface ExcelSheet {
    name: string;
    html: string;
    data: any[][];
}

// Helper function to convert ExcelJS color to CSS hex
function excelColorToHex(color: any): string {
    if (!color) return '';

    // ARGB format
    if (color.argb) {
        const argb = color.argb;
        // Strip alpha channel (first 2 chars)
        return '#' + argb.substring(2);
    }

    // Theme colors - default to empty
    return '';
}

// Generate styled HTML from ExcelJS worksheet
function generateStyledHTML(worksheet: ExcelJS.Worksheet, sheetName: string): string {
    let html = `<table id="sheet-${sheetName.replace(/[^a-zA-Z0-9]/g, '-')}">`;

    worksheet.eachRow((row) => {
        html += '<tr>';

        row.eachCell({ includeEmpty: true }, (cell) => {
            const cellValue = cell.value ? String(cell.value) : '';
            const styles: string[] = [];

            // Background color
            if (cell.fill && cell.fill.type === 'pattern' && cell.fill.fgColor) {
                const bgColor = excelColorToHex(cell.fill.fgColor);
                if (bgColor) styles.push(`background-color: ${bgColor}`);
            }

            // Font styles
            if (cell.font) {
                if (cell.font.color) {
                    const fontColor = excelColorToHex(cell.font.color);
                    if (fontColor) styles.push(`color: ${fontColor}`);
                }
                if (cell.font.bold) styles.push('font-weight: bold');
                if (cell.font.italic) styles.push('font-style: italic');
                if (cell.font.underline) styles.push('text-decoration: underline');
                if (cell.font.size) styles.push(`font-size: ${cell.font.size}pt`);
                if (cell.font.name) styles.push(`font-family: "${cell.font.name}", sans-serif`);
            }

            // Alignment
            if (cell.alignment) {
                if (cell.alignment.horizontal) {
                    styles.push(`text-align: ${cell.alignment.horizontal}`);
                }
                if (cell.alignment.vertical) {
                    const vAlign = cell.alignment.vertical === 'middle' ? 'middle' : cell.alignment.vertical;
                    styles.push(`vertical-align: ${vAlign}`);
                }
            }

            // Borders
            if (cell.border) {
                const borderStyle = '1px solid #000';
                if (cell.border.top && cell.border.top.style) styles.push(`border-top: ${borderStyle}`);
                if (cell.border.bottom && cell.border.bottom.style) styles.push(`border-bottom: ${borderStyle}`);
                if (cell.border.left && cell.border.left.style) styles.push(`border-left: ${borderStyle}`);
                if (cell.border.right && cell.border.right.style) styles.push(`border-right: ${borderStyle}`);
            }

            // Build td tag
            let tdTag = '<td';
            if (styles.length > 0) tdTag += ` style="${styles.join('; ')}"`;
            tdTag += '>';

            html += tdTag + cellValue + '</td>';
        });

        html += '</tr>';
    });

    html += '</table>';
    return html;
}

export const parseExcel = async (file: File): Promise<ExcelSheet[]> => {
    const workbook = new ExcelJS.Workbook();
    const buffer = await file.arrayBuffer();
    await workbook.xlsx.load(buffer);

    const sheets: ExcelSheet[] = [];

    workbook.eachSheet((worksheet) => {
        const name = worksheet.name;

        // Generate styled HTML
        const html = generateStyledHTML(worksheet, name);

        // Generate raw data for metadata
        const data: any[][] = [];
        worksheet.eachRow((row) => {
            const rowData: any[] = [];
            row.eachCell({ includeEmpty: true }, (cell) => {
                rowData.push(cell.value || '');
            });
            data.push(rowData);
        });

        sheets.push({ name, html, data });
    });

    return sheets;
};
