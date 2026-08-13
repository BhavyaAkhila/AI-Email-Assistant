import React from 'react';
import { Sparkles, LayoutDashboard, Mail, History as HistoryIcon, LogIn, UserPlus, LogOut } from 'lucide-react';
import { getCurrentUser } from '../services/authService';

const Header = ({ activeTab, setActiveTab, onLogout }) => {
  const currentUser = getCurrentUser();
  const isLoggedIn = !!currentUser;

  return (
    <header className="app-header">
      <div className="header-container">
        <a
          href="#dashboard"
          className="brand"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('dashboard');
          }}
        >
          <div className="brand-icon">
            <Sparkles size={20} />
          </div>
          <span>AI Email Assistant</span>
        </a>

        <nav className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            id="nav-tab-dashboard"
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-tab ${activeTab === 'generate' ? 'active' : ''}`}
            onClick={() => setActiveTab('generate')}
            id="nav-tab-generate"
          >
            <Mail size={16} />
            <span>Generate</span>
          </button>

          <button
            className={`nav-tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
            id="nav-tab-history"
          >
            <HistoryIcon size={16} />
            <span>History</span>
          </button>

          {!isLoggedIn ? (
            <>
              <button
                className={`nav-tab ${activeTab === 'login' ? 'active' : ''}`}
                onClick={() => setActiveTab('login')}
                id="nav-tab-login"
                style={{ marginLeft: '0.5rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}
              >
                <LogIn size={16} />
                <span>Login</span>
              </button>

              <button
                className={`nav-tab ${activeTab === 'register' ? 'active' : ''}`}
                onClick={() => setActiveTab('register')}
                id="nav-tab-register"
              >
                <UserPlus size={16} />
                <span>Register</span>
              </button>
            </>
          ) : (
            <button
              className="nav-tab"
              onClick={onLogout}
              id="nav-tab-logout"
              style={{ marginLeft: '0.5rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem', color: 'var(--accent-rose)' }}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
