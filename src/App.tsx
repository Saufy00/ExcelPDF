import { useState } from 'react';
import { Dropzone } from './components/Dropzone';
import { PreviewTable } from './components/PreviewTable';
import { parseExcel, type ExcelSheet } from './utils/excel';
import { generatePDF } from './utils/pdf';
import { FileDown, RefreshCw, Layers, Sheet, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

function App() {
  const [sheets, setSheets] = useState<ExcelSheet[]>([]);
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const activeSheet = sheets[activeSheetIndex];

  const handleFileAccepted = async (file: File) => {
    setLoading(true);
    try {
      const parsedSheets = await parseExcel(file);
      setSheets(parsedSheets);
      setActiveSheetIndex(0);
      setFileName(file.name.replace(/\.[^/.]+$/, ""));
    } catch (error) {
      console.error("Error parsing file:", error);
      alert("Error parsing Excel file");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (sheets.length === 0) return;
    generatePDF(sheets, fileName);
  };

  const handleReset = () => {
    setSheets([]);
    setFileName('');
    setActiveSheetIndex(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <Sheet className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
              Excel<span className="text-indigo-600">PDF</span>
            </h1>
          </div>

          {sheets.length > 0 && (
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Reset"
              >
                <RefreshCw className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium shadow-lg shadow-slate-900/20 transition-all"
              >
                <FileDown className="w-4 h-4" />
                <span>Export PDF</span>
              </motion.button>
            </div>
          )}
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {sheets.length === 0 ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center min-h-[60vh]"
            >
              <div className="text-center mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                    Transform Excel to PDF <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                      Beautifully & Instantly
                    </span>
                  </h2>
                  <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Preserve your layouts, merged cells, and formatting.
                    The professional way to convert your spreadsheets.
                  </p>
                </motion.div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <p className="text-slate-600 font-medium animate-pulse">Processing your file...</p>
                </div>
              ) : (
                <Dropzone onFileAccepted={handleFileAccepted} />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Sheet Tabs */}
              <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
                <div className="flex gap-1 min-w-max">
                  {sheets.map((sheet, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveSheetIndex(index)}
                      className={clsx(
                        "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
                        activeSheetIndex === index
                          ? "text-indigo-600"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      )}
                    >
                      {activeSheetIndex === index && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-indigo-50 rounded-lg"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        {sheet.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Area */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <h3 className="font-semibold text-slate-700">Preview</h3>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                    {activeSheet?.name}
                  </span>
                </div>

                {activeSheet && (
                  <motion.div
                    key={activeSheetIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PreviewTable data={activeSheet.html} />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <div className="text-center text-sm text-slate-400 py-8">
        <p>© 2024 ExcelPDF. All processing happens locally on your device.</p>
      </div>
    </div>
  );
}

export default App;
