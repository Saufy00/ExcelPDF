import { useState } from 'react';
import { Dropzone } from './components/Dropzone';
import { PreviewTable } from './components/PreviewTable';
import { parseExcel } from './utils/excel';
import { generatePDF } from './utils/pdf';
import { FileDown, FileSpreadsheet, RefreshCw } from 'lucide-react';

function App() {
  const [data, setData] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleFileAccepted = async (file: File) => {
    setLoading(true);
    try {
      const jsonData = await parseExcel(file);
      setData(jsonData);
      setFileName(file.name.replace(/\.[^/.]+$/, ""));
    } catch (error) {
      console.error("Error parsing file:", error);
      alert("Failed to parse Excel file");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (data.length === 0) return;
    generatePDF(data, `${fileName}.pdf`);
  };

  const handleReset = () => {
    setData([]);
    setFileName('');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl shadow-lg mb-4">
            <FileSpreadsheet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Excel to PDF Converter
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Transform your spreadsheets into professional PDF documents instantly.
            Secure, fast, and runs entirely in your browser.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 transition-all">
          {data.length === 0 ? (
            <div className="max-w-xl mx-auto">
              <Dropzone onFileAccepted={handleFileAccepted} />
              {loading && <p className="text-center mt-4 text-slate-500 animate-pulse">Processing file...</p>}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{fileName}</h2>
                  <p className="text-sm text-slate-500">{data.length} rows found</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset
                  </button>
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
                  >
                    <FileDown className="w-4 h-4" />
                    Export PDF
                  </button>
                </div>
              </div>

              <PreviewTable data={data} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-400">
          <p>© 2024 ExcelPDF. All processing happens locally on your device.</p>
        </div>

      </div>
    </div>
  );
}

export default App;
