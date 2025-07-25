import { useState, useEffect } from 'react';
import ResumeUploader from './components/ResumeUploader';
import PastResumesTable from './components/PastResumesTable';
import ResumeDetails from './components/ResumeDetails';
import Login from './components/Login';
import Signup from './components/Signup';
import axios from 'axios';

const App = () => {
  const [tab, setTab] = useState('login');
  const [uploadedResume, setUploadedResume] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    if (isAuthenticated) setTab('upload');
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setTab('upload');
  };

  const handleSignup = () => {
    setTab('login'); // Redirect to login after signup
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setTab('login');
  };

  const authHeader = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-4 p-4 bg-white shadow-md rounded-lg">
        <div>
          <h1 className="text-xl font-bold">DeepKlarity Resume Analyzer</h1>
          <p className="text-sm text-gray-500">AI-powered resume analysis and optimization</p>
        </div>
        <p className="text-sm text-gray-500">Powered by Google Gemini AI</p>
      </header>
      <nav className="mb-4 flex items-center space-x-4 bg-white rounded-lg shadow px-4 py-2">
        {isAuthenticated && (
          <>
          <div className="flex flex-row justify-between items-center w-full">
            <div>
              <button
                className={`px-4 py-2 mr-2 rounded transition-colors duration-200 ${
                  tab === 'upload'
                    ? 'bg-blue-600 text-white font-semibold shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                }`}
                onClick={() => setTab('upload')}
              >
                Resume Analysis
              </button>
              <button
                className={`px-4 py-2 rounded transition-colors duration-200 ${
                  tab === 'history'
                    ? 'bg-blue-600 text-white font-semibold shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                }`}
                onClick={() => setTab('history')}
              >
                Resume Viewer
              </button>
              </div>
              <button
                onClick={handleLogout}
                className="ml-auto px-4 py-2 rounded bg-red-600 text-white hover:bg-red-500 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </nav>
      {!isAuthenticated && tab === 'login' && <Login onLogin={handleLogin} />}
      {!isAuthenticated && tab === 'signup' && <Signup onSignup={handleSignup} />}
      {isAuthenticated && tab === 'upload' && (
        <>
          <ResumeUploader onUploadSuccess={setUploadedResume} authHeader={authHeader} />
          {uploadedResume && <ResumeDetails resume={uploadedResume} />}
        </>
      )}
      {isAuthenticated && tab === 'history' && <PastResumesTable authHeader={authHeader} />}
      {!isAuthenticated && (
        <div className="text-center mt-10">
          <button
            className="bg-blue-600 text-white p-2 rounded-md mr-4 hover:bg-blue-700"
            onClick={() => setTab('login')}
          >
            Login
          </button>
          <button
            className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
            onClick={() => setTab('signup')}
          >
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
};

export default App;