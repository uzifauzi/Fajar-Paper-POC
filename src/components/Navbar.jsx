import { CloudUpload } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
            {/* Top Left Logo placeholder */}
            {/* <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                    <CloudUpload className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Brand</span>
            </div> */}

            {/* Center Title */}
            <div className="absolute left-1/2 -translate-x-1/2">
                <h1 className="text-lg font-semibold text-gray-900">POC Upload File</h1>
            </div>

            {/* Right side empty to balance logo */}
            <div className="w-[84px]"></div>
        </nav>
    );
}
