import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, Trash2, Calendar, Sparkles } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import { apiService, extractGeneratedEmail } from '../services/api';

const EmailDetails = ({ email, onBack, showToast }) => {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  if (!email) {
    return (
      <div className="main-container">
        <button className="btn btn-secondary" onClick={onBack} style={{ marginBottom: '1rem' }}>
          <ArrowLeft size={16} /> Back to History
        </button>
        <p>Email details unavailable.</p>
      </div>
    );
  }

  const emailText = extractGeneratedEmail(email);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(emailText || '');
      setCopied(true);
      showToast('Copied email to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      showToast('Failed to copy email to clipboard.', 'error');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await apiService.deleteEmail(email.id);
      showToast('Email deleted successfully!', 'success');
      onBack(); // Return to history
    } catch (err) {
      showToast(err.message || 'Failed to delete email.', 'error');
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="main-container" style={{ maxWidth: '820px' }}>
      <button className="btn btn-ghost" onClick={onBack} style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} />
        <span>Back to History</span>
      </button>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <span className="form-label">SUBJECT</span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {email.subject || 'Untitled Email'}
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="badge badge-tone">{email.tone || 'General'}</span>
            <span className="badge badge-length">{email.length || 'Medium'}</span>
          </div>
        </div>

        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem' }}>
          <Calendar size={14} />
          <span>Created on {formatDate(email.createdAt)}</span>
        </div>

        {email.prompt && (
          <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--border-radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
            <span className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Sparkles size={14} style={{ color: 'var(--primary)' }} /> Original Prompt
            </span>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', fontStyle: 'italic' }}>
              "{email.prompt}"
            </p>
          </div>
        )}

        <div style={{ marginBottom: '2rem' }}>
          <span className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
            GENERATED EMAIL CONTENT
          </span>
          <div
            style={{
              background: 'var(--bg-input)',
              padding: '1.25rem',
              borderRadius: 'var(--border-radius-md)',
              border: '1px solid var(--border-color)',
              whiteSpace: 'pre-wrap', // Format newlines properly
              wordBreak: 'break-word',
              lineHeight: 1.7,
              fontSize: '0.98rem',
              color: 'var(--text-main)',
            }}
          >
            {emailText || 'No email content.'}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <button className="btn btn-danger" onClick={() => setShowConfirmModal(true)} id="btn-details-delete">
            <Trash2 size={16} />
            <span>Delete Email</span>
          </button>

          <button className="btn btn-secondary" onClick={handleCopy} id="btn-details-copy">
            {copied ? (
              <>
                <Check size={16} style={{ color: 'var(--accent-emerald)' }} />
                <span style={{ color: 'var(--accent-emerald)' }}>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Copy Content</span>
              </>
            )}
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmModal}
        title="Delete Email"
        message={`Are you sure you want to delete "${email.subject || 'this email'}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirmModal(false)}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default EmailDetails;
