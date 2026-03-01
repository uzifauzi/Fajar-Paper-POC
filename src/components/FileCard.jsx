import * as React from 'react';
import { Trash2, File, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

export function FileCard({ file, isUploading = false, progress = 0, onRemove, error }) {
    const sizeInMB = file.size ? (file.size / (1024 * 1024)).toFixed(2) : 0;

    return (
        <div className={cn(
            "flex w-full items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:bg-gray-50",
            error && "border-red-300 bg-red-50 hover:bg-red-50"
        )}>
            {/* Icon */}
            <div className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-[0_0_0_8px_rgba(244,235,255,1)]",
                error ? "bg-red-100 text-red-600 shadow-red-50" : "bg-purple-100 text-purple-600"
            )}>
                <File className="h-5 w-5" />
            </div>

            <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col truncate">
                        <span className={cn(
                            "truncate text-sm font-medium",
                            error ? "text-red-700" : "text-gray-700"
                        )}>
                            {file.name}
                        </span>
                        <span className={cn(
                            "text-sm",
                            error ? "text-red-600" : "text-gray-500"
                        )}>
                            {sizeInMB} MB
                        </span>
                    </div>
                    <button
                        onClick={onRemove}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove file</span>
                    </button>
                </div>

                {isUploading && !error && (
                    <div className="mt-2 flex items-center gap-3">
                        <div className="h-2 w-full flex-1 overflow-hidden rounded-full bg-gray-200">
                            <div
                                className="h-full rounded-full bg-purple-600 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{progress}%</span>
                    </div>
                )}

                {error && (
                    <div className="text-sm text-red-600 mt-1">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
