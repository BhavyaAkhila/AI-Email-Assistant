import React, { useState } from 'react';
import { Eye, Trash2, Calendar, Copy, Check, RefreshCw } from 'lucide-react';
import { extractGeneratedEmail } from '../services/api';

const EmailCard = ({ email, onView, onDelete, onRegenerate, onCopySuccess }) => {
  const [copied, setCopied] = useState(false);

  const emailText = extractGeneratedEmail(email);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently saved';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(emailText);
      setCopied(true);
      if (onCopySuccess) onCopySuccess();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="card history-card">
      <div>
        <div className="history-card-header">
          <h3 className="history-subject">{email.subject || 'Untitled Email'}</h3>
          <span className="badge badge-tone">{email.tone || 'General'}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
          <span className="badge badge-length">{email.length || 'Medium'}</span>
          <span className="badge-date" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Calendar size={12} />
            {formatDate(email.createdAt)}
          </span>
        </div>

        {email.prompt && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '0.4rem' }}>
            Prompt: "{email.prompt}"
          </p>
        )}

        <p className="history-preview">
          {emailText || 'No email text preview available'}
        </p>
      </div>

      <div className="history-card-footer" style={{ flexWrap: 'wrap', gap: '0.4rem' }}>
        <button
          className="btn btn-ghost"
          style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem' }}
          onClick={() => onView(email)}
          id={`btn-view-${email.id}`}
          title="View email details"
        >
          <Eye size={14} />
          <span>View</span>
        </button>

        <button
          className="btn btn-ghost"
          style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem' }}
          onClick={handleCopy}
          id={`btn-copy-${email.id}`}
          title="Copy email body"
        >
          {copied ? <Check size={14} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>

        <button
          className="btn btn-ghost"
          style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem' }}
          onClick={() => onRegenerate(email)}
          id={`btn-regen-${email.id}`}
          title="Regenerate this email"
        >
          <RefreshCw size={14} />
          <span>Regenerate</span>
        </button>

        <button
          className="btn btn-danger"
          style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem', marginLeft: 'auto' }}
          onClick={() => onDelete(email)}
          id={`btn-delete-${email.id}`}
          title="Delete email"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default EmailCard;
