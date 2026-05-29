import React, { useState, useEffect } from 'react';
import FileUploadArea from './components/FileUploadArea';
import DocumentList from './components/DocumentList';
import NotificationBell from './components/NotificationBell';
import { getNotifications } from './api/client';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isBulkUpload, setIsBulkUpload] = useState(false);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Initialize dark mode
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    updateDarkMode(isDark);

    // Fetch initial notifications
    // eslint-disable-next-line react-hooks/immutability
    fetchNotifications();

    // Connect to WebSocket
    connectWebSocket();

    return () => {
      if (ws) ws.close();
    };
  }, []);

  const connectWebSocket = () => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';
    try {
      const websocket = new WebSocket(wsUrl);

      websocket.onopen = () => {
        console.log('WebSocket connected');
      };

      websocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'notification') {
          setNotifications(prev => [message.data, ...prev]);
        }
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      websocket.onclose = () => {
        console.log('WebSocket disconnected');
        setTimeout(() => connectWebSocket(), 5000);
      };

      setWs(websocket);
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const updateDarkMode = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    updateDarkMode(newDarkMode);
  };

  const handleUploadSuccess = (data) => {
    fetchNotifications();
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 backdrop-blur-lg bg-opacity-80 dark:bg-opacity-80">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo to-violet rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Document Manager</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Upload & Manage PDFs</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <NotificationBell
                notifications={notifications}
                setNotifications={setNotifications}
              />
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                {darkMode ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm5.414 5.414a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707zM5 11a1 1 0 100-2H4a1 1 0 100 2h1z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-8">
          <div className="space-y-8">
            {/* Upload Section */}
            <section>
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Upload Documents</h2>
                <p className="text-gray-600 dark:text-gray-400">Drag and drop your PDF files or click to select</p>
              </div>
              <FileUploadArea
                onUploadSuccess={handleUploadSuccess}
                isBulkUpload={isBulkUpload}
                setIsBulkUpload={setIsBulkUpload}
              />
            </section>

            {/* Documents Section */}
            <section>
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Documents</h2>
              </div>
              <DocumentList refreshTrigger={refreshTrigger} />
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-16 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-6xl mx-auto px-6 py-8 text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2024 Document Management System. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
