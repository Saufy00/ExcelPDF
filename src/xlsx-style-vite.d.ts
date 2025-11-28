declare module 'xlsx-style-vite' {
    export = XLSX;
    export as namespace XLSX;

    namespace XLSX {
        export const utils: any;
        export function read(data: any, opts?: any): any;
        export interface WorkSheet {
            [key: string]: any;
            '!ref'?: string;
            '!merges'?: any[];
        }
        export interface WorkBook {
            SheetNames: string[];
            Sheets: { [sheet: string]: WorkSheet };
        }
    }
}
