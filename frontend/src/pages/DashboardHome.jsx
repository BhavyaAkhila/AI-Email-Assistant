import React, { useState, useEffect } from 'react';
import { Sparkles, Mail, Eye, Calendar, AlertCircle, Inbox } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiService, extractGeneratedEmail } from '../services/api';

const DashboardHome = ({ onNavigateGenerate, onViewEmail }) => {
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const data = await apiService.getEmails();
      setEmails(data || []);
    } catch (err) {
      setErrorMsg('Unable to load dashboard data. Please make sure the backend is running.');
      setEmails([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Safe case-insensitive tone counting
  const totalCount = emails.length;
  const proCount = emails.filter((e) => e.tone && e.tone.toLowerCase() === 'professional').length;
  const friendlyCount = emails.filter((e) => e.tone && e.tone.toLowerCase() === 'friendly').length;
  const formalCount = emails.filter((e) => e.tone && e.tone.toLowerCase() === 'formal').length;

  // Sort by createdAt descending (newest first) and take latest 5
  const recentEmails = [...emails]
    .sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : (a.id || 0);
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : (b.id || 0);
      return timeB - timeA;
    })
    .slice(0, 5);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="main-container">
      {/* Banner / Header */}
      <div className="dashboard-banner">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
            AI Email Assistant
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Generate professional emails with the power of AI.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={onNavigateGenerate}
          id="btn-dashboard-generate-cta"
        >
          <Sparkles size={18} />
          <span>Generate Email</span>
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Loading dashboard statistics..." />
      ) : errorMsg ? (
        <div className="empty-state">
          <div className="empty-icon" style={{ color: 'var(--accent-rose)' }}>
            <AlertCircle size={28} />
          </div>
          <h3 className="empty-title">Unable to load dashboard data</h3>
          <p className="empty-desc">Please make sure the backend is running and reachable.</p>
          <button className="btn btn-secondary" onClick={fetchDashboardData} id="btn-retry-dashboard">
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Statistics Cards Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrapper stat-icon-total">
                <Mail size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Emails</span>
                <span className="stat-number">{totalCount}</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper stat-icon-pro">
                <Sparkles size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Professional</span>
                <span className="stat-number">{proCount}</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper stat-icon-friendly">
                <Mail size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Friendly</span>
                <span className="stat-number">{friendlyCount}</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper stat-icon-formal">
                <Sparkles size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Formal</span>
                <span className="stat-number">{formalCount}</span>
              </div>
            </div>
          </div>

          {/* Recent Emails Section */}
          <div style={{ marginTop: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
              Recent Emails
            </h2>

            {recentEmails.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <Inbox size={28} />
                </div>
                <h3 className="empty-title">No emails yet</h3>
                <p className="empty-desc">Generate your first AI-powered email.</p>
                <button
                  className="btn btn-primary"
                  onClick={onNavigateGenerate}
                  id="btn-empty-generate-cta"
                >
                  <Sparkles size={16} />
                  <span>Generate Email</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentEmails.map((email) => {
                  const textPreview = extractGeneratedEmail(email);
                  return (
                    <div
                      key={email.id}
                      className="card"
                      style={{
                        padding: '1.25rem 1.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '260px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            {email.subject || 'Untitled Email'}
                          </h3>
                          <span className="badge badge-tone">{email.tone || 'General'}</span>
                          <span className="badge badge-length">{email.length || 'Medium'}</span>
                        </div>

                        <p className="history-preview" style={{ marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                          {textPreview || email.prompt || 'No content preview'}
                        </p>

                        <span className="badge-date" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Calendar size={12} />
                          {formatDate(email.createdAt)}
                        </span>
                      </div>

                      <button
                        className="btn btn-secondary"
                        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                        onClick={() => onViewEmail(email)}
                        id={`btn-recent-view-${email.id}`}
                      >
                        <Eye size={15} />
                        <span>View</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardHome;
