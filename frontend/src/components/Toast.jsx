import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="toast-container">
      <div className={`toast toast-${type}`}>
        <div className="toast-icon">
          {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
        </div>
        <div style={{ flex: 1 }}>{message}</div>
        <button
          className="btn-ghost"
          onClick={onClose}
          style={{ padding: '0.1rem', cursor: 'pointer' }}
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
