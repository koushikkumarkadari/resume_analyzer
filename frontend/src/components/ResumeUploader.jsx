import { useState } from 'react';
import axios from 'axios';


const ResumeUploader = ({ onUploadSuccess, authHeader }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async () => {
    if (!file) return setError('Please select a PDF file');
    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/resumes/upload`, formData, authHeader);
      onUploadSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Upload Your Resume</h2>
      <div className="border-2 border-dashed border-gray-300 p-10 text-center">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
          id="fileInput"
        />
        <label htmlFor="fileInput" className="cursor-pointer text-blue-600">
          Choose a file
        </label>
        {file && (
          <p className="mt-2 text-green-600 font-medium">
            Selected file: {file.name}
          </p>
        )}
        <p className="text-gray-500 mt-2">or drag and drop your PDF resume here</p>
        <p className="text-gray-500 text-sm">Supported format: PDF (max 10MB)</p>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="mt-4 w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 disabled:bg-gray-400"
      >
        {loading ? 'Analyzing...' : 'Analyze Resume'}
      </button>
    </div>
  );
};

export default ResumeUploader;