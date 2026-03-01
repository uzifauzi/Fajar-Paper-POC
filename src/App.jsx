import { useState } from 'react';
import Navbar from './components/Navbar';
import { FileUploader } from './components/FileUploader';
import { FileCard } from './components/FileCard';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { uploadFileToSupabase, triggerWorkflow } from './services/api';
import { Alert, AlertTitle, AlertDescription } from './components/ui/alert';


function App() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [alertInfo, setAlertInfo] = useState({ show: false, type: 'default', message: '' });

  const handleUpload = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setIsUploading(false);
      setProgress(0);
      setAlertInfo({ show: false, type: 'default', message: '' });
    }
  };

  const handleRemove = () => {
    setFile(null);
    setIsUploading(false);
    setProgress(0);
    setAlertInfo({ show: false, type: 'default', message: '' });
  };

  const handleUploadSubmit = async () => {
    if (!file) return;
    setIsUploading(true);
    setProgress(0);
    setAlertInfo({ show: false, type: 'default', message: '' });

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
        setAlertInfo({ show: true, type: 'default', message: 'File uploaded successfully!' });
        setFile(null);
        setProgress(0);
      }, 500);
    } catch (error) {
      clearInterval(interval);
      setIsUploading(false);
      setProgress(0);
      setAlertInfo({ show: true, type: 'destructive', message: `Upload failed: ${error.message}` });
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

          {/* Alert Section */}
          {alertInfo.show && (
            <Alert
              variant={alertInfo.type}
              className={`mb-6 ${alertInfo.type === 'default' ? 'border-green-500/50 text-green-700 bg-green-50 [&>svg]:text-green-600' : ''}`}
            >
              {alertInfo.type === 'default' ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>{alertInfo.type === 'default' ? 'success' : 'failure'}</AlertTitle>
              <AlertDescription>{alertInfo.message}</AlertDescription>
            </Alert>
          )}

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

        </div>
      </main>
    </div>
  );
}

export default App;
