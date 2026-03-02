import { useState } from 'react';
import Navbar from './components/Navbar';
import { FileUploader } from './components/FileUploader';
import { FileCard } from './components/FileCard';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { uploadFileToSupabase, triggerWorkflow, extractPdfOcr } from './services/api';
import { Alert, AlertTitle, AlertDescription } from './components/ui/alert';


function App() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [alertInfo, setAlertInfo] = useState({ show: false, type: 'default', message: '' });
  const [ocrResult, setOcrResult] = useState(null);
  const [ocrHistory, setOcrHistory] = useState([]);

  const handleUpload = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setIsUploading(false);
      setProgress(0);
      setOcrResult(null);
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
      setAlertInfo({ show: true, type: 'default', message: 'Extracting data with OCR...' });

      const extractionResult = await extractPdfOcr(file);
      setOcrResult(extractionResult);
      setOcrHistory(prev => [
        { fileName: file.name, date: new Date().toISOString(), result: extractionResult },
        ...prev
      ]);

      setAlertInfo({ show: true, type: 'default', message: 'OCR successful. Uploading to Supabase...' });

      const publicUrl = await uploadFileToSupabase(file);
      console.log("Supabase Public URL:", publicUrl);

      setAlertInfo({ show: true, type: 'default', message: 'Triggering workflow...' });

      const workflowResponse = await triggerWorkflow(publicUrl, file.name);
      console.log("Workflow Trigger Response:", workflowResponse);

      clearInterval(interval);
      setProgress(100);

      setTimeout(() => {
        setIsUploading(false);
        setAlertInfo({ show: true, type: 'default', message: 'File processed and uploaded successfully!' });
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

          {/* Latest OCR Result */}
          {ocrResult && (
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-4">Latest Extraction Result</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 font-medium mb-1">Document Type</p>
                  <p className="text-lg font-semibold text-gray-900">{ocrResult.doc_type || 'Unknown'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 font-medium mb-1">Confidence Score</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {ocrResult.confidence != null ? `${(ocrResult.confidence * 100).toFixed(1)}%` : 'N/A'}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg col-span-2">
                  <p className="text-sm text-gray-500 font-medium mb-1">Customer Name</p>
                  <p className="text-lg font-semibold text-gray-900">{ocrResult.customer_name || 'N/A'}</p>
                </div>
                {ocrResult.confidence_gap_reason && ocrResult.confidence_gap_reason.length > 0 && (
                  <div className="p-4 bg-amber-50 rounded-lg col-span-2 border border-amber-200">
                    <p className="text-sm text-amber-800 font-medium mb-1">Confidence Gap Reasons</p>
                    <ul className="list-disc list-inside text-amber-700 text-sm">
                      {ocrResult.confidence_gap_reason.map((reason, idx) => (
                        <li key={idx}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <p className="text-sm text-gray-500 font-medium mb-2">Extracted Metadata</p>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-green-400 font-mono">
                    {JSON.stringify(ocrResult.metadata_extraction || {}, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* OCR History */}
          {ocrHistory.length > 0 && (
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-4">Extraction History</h3>
              <div className="space-y-4">
                {ocrHistory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">{item.fileName}</p>
                      <p className="text-xs text-gray-500">{new Date(item.date).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.result.doc_type || 'Unknown'}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Conf: {item.result.confidence != null ? `${(item.result.confidence * 100).toFixed(1)}%` : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default App;
