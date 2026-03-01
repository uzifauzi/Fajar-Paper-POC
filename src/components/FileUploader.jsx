import * as React from 'react';
import { CloudUpload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { cn } from '../lib/utils';

export function FileUploader({ className, onUpload, ...props }) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            if (onUpload) {
                onUpload(acceptedFiles);
            }
        },
        ...props,
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                'relative flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white px-6 py-8 text-center transition hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100',
                isDragActive && 'border-purple-600 bg-purple-50 hover:bg-purple-50',
                className
            )}
        >
            <input {...getInputProps()} />
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 shadow-[0_0_0_8px_rgba(244,235,255,1)]">
                <CloudUpload className="h-5 w-5" />
            </div>
            <div className="mb-1 text-sm font-semibold text-purple-700">
                Click to upload <span className="font-normal text-gray-600">or drag and drop</span>
            </div>
            <div className="text-xs text-gray-500">
                SVG, PNG, JPG or GIF (max. 800x400px)
            </div>
        </div>
    );
}
