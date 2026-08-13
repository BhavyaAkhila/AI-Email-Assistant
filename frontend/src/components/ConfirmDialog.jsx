import React from 'react';
import { AlertTriangle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ color: 'var(--accent-rose)' }}>
            <AlertTriangle size={24} />
          </div>
          <h3 className="modal-title">{title || 'Confirm Action'}</h3>
        </div>
        <p className="modal-desc">{message || 'Are you sure you want to proceed?'}</p>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={isLoading} id="btn-confirm-delete">
            {isLoading ? <LoadingSpinner label="Deleting..." inline /> : 'Delete Email'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
