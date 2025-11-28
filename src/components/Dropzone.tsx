import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropzoneProps {
    onFileAccepted: (file: File) => void;
}

export function Dropzone({ onFileAccepted }: DropzoneProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onFileAccepted(acceptedFiles[0]);
        }
    }, [onFileAccepted]);

    const onDropRejected = useCallback((fileRejections: any[]) => {
        console.log("File rejected:", fileRejections);
        alert("Please upload a valid Excel file (.xlsx or .xls)");
    }, []);

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        onDropRejected,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls']
        },
        maxFiles: 1,
        multiple: false
    });

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div
                {...getRootProps()}
                className={`
          relative overflow-hidden rounded-3xl border-2 border-dashed
          transition-all duration-300 cursor-pointer
          flex flex-col items-center justify-center
          p-12 md:p-16 text-center
          ${isDragActive
                        ? 'border-indigo-500 bg-indigo-50/50 shadow-2xl shadow-indigo-500/20'
                        : 'border-slate-200 bg-white/50 hover:border-indigo-300 hover:bg-white hover:shadow-xl'
                    }
          ${isDragReject ? 'border-red-500 bg-red-50' : ''}
        `}
            >
                <input {...getInputProps()} />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={isDragActive ? 'active' : 'idle'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <div className={`
              p-6 rounded-2xl shadow-lg
              ${isDragActive ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'}
              transition-colors duration-300
            `}>
                            {isDragReject ? (
                                <AlertCircle className="w-10 h-10" />
                            ) : isDragActive ? (
                                <Upload className="w-10 h-10 animate-bounce" />
                            ) : (
                                <FileSpreadsheet className="w-10 h-10" />
                            )}
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl md:text-2xl font-bold text-slate-800">
                                {isDragActive ? "Drop your Excel file here" : "Upload your Excel file"}
                            </h3>
                            <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                                {isDragActive
                                    ? "Release to start processing instantly"
                                    : "Drag and drop or click to browse. Supports .xlsx and .xls files."}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Decorative background blobs */}
                <div className="absolute -z-10 top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-200 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-violet-200 rounded-full blur-3xl" />
                </div>
            </div>
        </div>
    );
}
