
interface PreviewTableProps {
    data: any[];
}

export function PreviewTable({ data }: PreviewTableProps) {
    if (!data || data.length === 0) return null;

    const headers = Object.keys(data[0]);

    return (
        <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
            <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                    <tr>
                        {headers.map((header) => (
                            <th key={header} className="px-6 py-3 font-medium whitespace-nowrap">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.slice(0, 10).map((row, index) => (
                        <tr key={index} className="bg-white border-b border-slate-100 hover:bg-slate-50 last:border-0">
                            {headers.map((header) => (
                                <td key={`${index}-${header}`} className="px-6 py-4 whitespace-nowrap">
                                    {row[header]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {data.length > 10 && (
                <div className="p-4 text-center text-sm text-slate-500 bg-slate-50 border-t border-slate-200">
                    Showing first 10 rows of {data.length} total rows
                </div>
            )}
        </div>
    );
}
