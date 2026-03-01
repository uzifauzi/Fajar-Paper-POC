import { useState } from 'react';
import Navbar from './components/Navbar';
import { FileUploader } from './components/FileUploader';
import { FileCard } from './components/FileCard';
import { FileDown, X } from 'lucide-react';
import { uploadFileToSupabase, triggerWorkflow } from './services/api';

function App() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setIsUploading(false);
      setProgress(0);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setIsUploading(false);
    setProgress(0);
  };

  const handleUploadSubmit = async () => {
    if (!file) return;
    setIsUploading(true);
    setProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          return 90; // Cap at 90% until finished
        }
        return prev + 10;
      });
    }, 300);

    try {
      const publicUrl = await uploadFileToSupabase(file);
      await triggerWorkflow(publicUrl, file.name);

      clearInterval(interval);
      setProgress(100);

      setTimeout(() => {
        setIsUploading(false);
        alert('File uploaded successfully!');
        setFile(null);
        setProgress(0);
      }, 500);
    } catch (error) {
      clearInterval(interval);
      setIsUploading(false);
      setProgress(0);
      alert(`Upload failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Top Navbar */}
      <Navbar />

      <main className="flex-1 flex flex-col items-center pt-16 px-6">
        <div className="w-full max-w-2xl space-y-12">

          {/* Header Section */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
              Upload your file to Scan With OCR
            </h2>
            <p className="text-gray-500">
              Upload your file
            </p>
          </div>

          {/* Upload Area */}
          <div className="space-y-6 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <FileUploader onUpload={handleUpload} />

            {/* Uploaded File List */}
            {file && (
              <div className="pt-4 space-y-4">
                <FileCard
                  file={file}
                  onRemove={handleRemove}
                  isUploading={isUploading}
                  progress={progress}
                />

                {/* Upload Action */}
                <button
                  onClick={handleUploadSubmit}
                  disabled={isUploading}
                  className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {isUploading ? 'Uploading...' : 'Upload File'}
                </button>
              </div>
            )}
          </div>

          {/* Example Template Section based on the image */}
          {/* <div className="pt-8">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Template file to download
            </h3>

            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  <FileDown className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">Template Classification.xlsx</span>
                  <span className="text-xs text-gray-500">4.49 KB</span>
                </div>
              </div>

              <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm">
                <FileDown className="w-4 h-4" />
                Download
              </button>
            </div>
          </div> */}

        </div>
      </main>
    </div>
  );
}

export default App;
