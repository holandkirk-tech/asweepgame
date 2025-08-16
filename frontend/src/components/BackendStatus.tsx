import { useState, useEffect } from "react";
import { apiService } from "../services/api";

const BackendStatus = () => {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [backendUrl, setBackendUrl] = useState('');

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      setStatus('loading');
      const result = await apiService.healthCheck();
      setStatus('connected');
      setMessage(result.status);
      setBackendUrl(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000');
    } catch (error) {
      setStatus('error');
      setMessage('Backend connection failed');
      setBackendUrl(import.meta.env.VITE_BACKEND_URL || 'Not configured');
    }
  };

  const testDatabase = async () => {
    try {
      const result = await apiService.testDatabase();
      alert(`Database Test: ${result.status}\nTime: ${result.time}`);
    } catch (error) {
      alert('Database connection failed');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${
          status === 'connected' ? 'bg-green-500' : 
          status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
        }`}></div>
        <span className="font-semibold">Backend Status</span>
      </div>
      
      <div className="space-y-1">
        <div>Status: {message}</div>
        <div>URL: {backendUrl}</div>
        <div className="flex gap-2 mt-2">
          <button 
            onClick={checkBackendHealth}
            className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
          >
            Refresh
          </button>
          <button 
            onClick={testDatabase}
            className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
          >
            Test DB
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackendStatus;
