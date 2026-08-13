import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DashboardHome from './pages/DashboardHome';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import EmailDetails from './pages/EmailDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Toast from './components/Toast';
import { logout, isLoggedIn } from './services/authService';
import './styles/index.css';
import './styles/components.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(isLoggedIn());
    if (!isLoggedIn()) {
      setActiveTab('login');
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleCloseToast = () => {
    setToast({ message: '', type: 'success' });
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setSelectedEmail(null);
    setActiveTab('login');
    showToast('Logged out successfully', 'success');
  };

  const handleViewEmail = (email) => {
    setSelectedEmail(email);
    setActiveTab('details');
  };

  const handleRegenerateFromHistory = (email) => {
    setSelectedEmail(email);
    setActiveTab('generate');
  };

  const handleBackToHistory = () => {
    setSelectedEmail(null);
    setActiveTab('history');
  };

  const handleTabChange = (tab) => {
    if (!isAuthenticated && tab !== 'login' && tab !== 'register') {
      setActiveTab('login');
      return;
    }
    if (tab !== 'details') {
      setSelectedEmail(null);
    }
    setActiveTab(tab);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header activeTab={activeTab} setActiveTab={handleTabChange} onLogout={handleLogout} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'dashboard' && isAuthenticated && (
          <DashboardHome
            onNavigateGenerate={() => setActiveTab('generate')}
            onViewEmail={handleViewEmail}
          />
        )}
        {activeTab === 'generate' && isAuthenticated && <Dashboard showToast={showToast} />}
        {activeTab === 'history' && isAuthenticated && (
          <History
            onViewEmail={handleViewEmail}
            onRegenerateEmail={handleRegenerateFromHistory}
            showToast={showToast}
          />
        )}
        {activeTab === 'details' && isAuthenticated && (
          <EmailDetails
            email={selectedEmail}
            onBack={handleBackToHistory}
            showToast={showToast}
          />
        )}
        {activeTab === 'login' && (
          <Login
            onNavigateRegister={() => setActiveTab('register')}
            onNavigateHome={() => {
              setIsAuthenticated(true);
              setActiveTab('dashboard');
            }}
            showToast={showToast}
          />
        )}
        {activeTab === 'register' && (
          <Register
            onNavigateLogin={() => setActiveTab('login')}
            onNavigateHome={() => {
              setIsAuthenticated(true);
              setActiveTab('dashboard');
            }}
            showToast={showToast}
          />
        )}
      </main>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={handleCloseToast}
      />
    </div>
  );
}

export default App;
