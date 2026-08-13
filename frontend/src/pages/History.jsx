import React, { useState, useEffect } from 'react';
import { Search, Filter, RotateCcw, MailSearch, AlertCircle } from 'lucide-react';
import EmailCard from '../components/EmailCard';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiService } from '../services/api';

const TONE_OPTIONS = [
  'All Tones',
  'Professional',
  'Friendly',
  'Formal',
  'Casual',
  'Apologetic',
  'Thank You',
  'Follow-up',
];

const History = ({ onViewEmail, onRegenerateEmail, showToast }) => {
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTone, setSelectedTone] = useState('All Tones');

  // Delete modal state
  const [emailToDelete, setEmailToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce search input by 400ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Main data fetching effect responding to debounced search or tone filter changes
  useEffect(() => {
    fetchHistoryData(debouncedSearch, selectedTone);
  }, [debouncedSearch, selectedTone]);

  const fetchHistoryData = async (search, tone) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      let data = [];

      const hasSearch = Boolean(search);
      const hasTone = Boolean(tone && tone !== 'All Tones');

      if (hasSearch && hasTone) {
        // Combined search + tone filter:
        // Use existing endpoint GET /api/emails/subject/{subject} then filter by tone on frontend
        const searchResults = await apiService.searchEmailsBySubject(search);
        data = searchResults.filter(
          (item) => item.tone && item.tone.toLowerCase() === tone.toLowerCase()
        );
      } else if (hasSearch) {
        // GET /api/emails/subject/{subject}
        data = await apiService.searchEmailsBySubject(search);
      } else if (hasTone) {
        // GET /api/emails/tone/{tone}
        data = await apiService.getEmailsByTone(tone);
      } else {
        // GET /api/emails
        data = await apiService.getEmails();
      }

      setEmails(data);
    } catch (err) {
      setErrorMessage('Unable to load emails. Please make sure the backend is running.');
      setEmails([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedTone('All Tones');
  };

  const confirmDelete = async () => {
    if (!emailToDelete) return;
    setIsDeleting(true);
    try {
      await apiService.deleteEmail(emailToDelete.id);
      // Remove email from frontend state immediately
      setEmails((prev) => prev.filter((item) => item.id !== emailToDelete.id));
      showToast('Email deleted successfully!', 'success');
      setEmailToDelete(null);
    } catch (err) {
      showToast(err.message || 'Failed to delete email.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper for grammatically correct result count
  const getResultCountText = () => {
    const count = emails.length;
    if (count === 0) return 'No emails found';
    if (count === 1) return '1 email';
    return `${count} emails`;
  };

  const isFiltered = Boolean(searchTerm.trim()) || selectedTone !== 'All Tones';

  return (
    <div className="main-container">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          Email History
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Browse, search by subject, filter by tone, or manage your saved AI emails.
        </p>
      </div>

      <div className="history-toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            id="input-search-history"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} style={{ color: 'var(--text-muted)' }} />
          <select
            className="form-select filter-select"
            value={selectedTone}
            onChange={(e) => setSelectedTone(e.target.value)}
            id="select-filter-tone"
          >
            {TONE_OPTIONS.map((tone) => (
              <option key={tone} value={tone}>
                {tone}
              </option>
            ))}
          </select>
        </div>

        {isFiltered && (
          <button
            className="btn btn-secondary"
            onClick={handleClearFilters}
            style={{ fontSize: '0.85rem', padding: '0.65rem 1rem' }}
            id="btn-clear-filters"
          >
            <RotateCcw size={14} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Result Count */}
      {!isLoading && !errorMessage && (
        <div className="result-count-bar">
          <span className="result-count">{getResultCountText()}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <LoadingSpinner label="Searching emails..." />
      ) : errorMessage ? (
        /* Error State */
        <div className="empty-state">
          <div className="empty-icon" style={{ color: 'var(--accent-rose)' }}>
            <AlertCircle size={28} />
          </div>
          <h3 className="empty-title">Connection Error</h3>
          <p className="empty-desc">{errorMessage}</p>
          <button className="btn btn-secondary" onClick={() => fetchHistoryData(debouncedSearch, selectedTone)}>
            Retry Loading
          </button>
        </div>
      ) : emails.length === 0 ? (
        /* Empty State */
        <div className="empty-state">
          <div className="empty-icon">
            <MailSearch size={28} />
          </div>
          <h3 className="empty-title">No emails found</h3>
          <p className="empty-desc">
            {isFiltered
              ? 'Try a different search term or filter.'
              : 'You have not saved any AI generated emails yet.'}
          </p>
          {isFiltered && (
            <button className="btn btn-secondary" onClick={handleClearFilters}>
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        /* Email Cards Grid */
        <div className="history-grid">
          {emails.map((email) => (
            <EmailCard
              key={email.id}
              email={email}
              onView={onViewEmail}
              onDelete={setEmailToDelete}
              onRegenerate={onRegenerateEmail}
              onCopySuccess={() => showToast('Email copied to clipboard!', 'success')}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(emailToDelete)}
        title="Delete Email"
        message={`Are you sure you want to delete "${emailToDelete?.subject || 'this email'}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setEmailToDelete(null)}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default History;
