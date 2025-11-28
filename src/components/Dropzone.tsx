import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileSpreadsheet } from 'lucide-react';

interface DropzoneProps {
    onFileAccepted: (file: File) => void;
}

export function Dropzone({ onFileAccepted }: DropzoneProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onFileAccepted(acceptedFiles[0]);
        }
    }, [onFileAccepted]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onDropRejected: (fileRejections) => {
            console.error("File rejected:", fileRejections);
            alert(`File rejected: ${fileRejections[0].errors[0].message}`);
        },
        onError: (err) => console.error("Dropzone error:", err),
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
        },
        maxFiles: 1,
    });

    return (
        <div
            {...getRootProps()}
            className={`
        border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'}
      `}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-4">
                <div className="p-4 bg-slate-100 rounded-full">
                    {isDragActive ? (
                        <FileSpreadsheet className="w-8 h-8 text-blue-500" />
                    ) : (
                        <UploadCloud className="w-8 h-8 text-slate-400" />
                    )}
                </div>
                <div>
                    <p className="text-lg font-medium text-slate-700">
                        {isDragActive ? 'Drop the Excel file here' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                        Supports .xlsx and .xls
                    </p>
                </div>
            </div>
        </div>
    );
}
